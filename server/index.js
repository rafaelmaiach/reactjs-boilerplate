/* eslint-disable global-require */
const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const { Router } = express;

const serverInit = require('./server.init');
const config = require('./config');

module.exports = (app, dirname) => {
  if (config.env !== 'development') {
    app.use(rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }));
  }

  const api = Router();

  app.use(bodyParser.json());
  app.use(cookieParser(config.cookieSecret, { sameSite: true, secure: true, httpOnly: true }));

  const isInProduction = config.env === 'production';

  const publicDir = path.join(dirname, 'dist');
  const clientDir = path.join(dirname, 'src');
  const publicPath = expressStaticGzip(publicDir);

  app.use('/dist', publicPath);

  app.set('view engine', 'pug');
  const viewsProd = path.join(publicDir, 'views');
  const viewsDev = path.join(clientDir, 'views/dev');
  const viewsPath = (isInProduction) ? viewsProd : viewsDev;
  app.set('views', viewsPath);

  app.use(compression());

  if (isInProduction) {
    app.get('/dist/*.js', (req, res, next) => {
      req.url = `${req.url}.gz`;
      res.set('Content-Encoding', 'gzip');
      next();
    });
  }

  if (!isInProduction) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const webpackConfig = require('../webpack.common');
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      logLevel: 'warn',
      silent: true,
      stats: 'errors-only',
    }));

    app.use(webpackHotMiddleware(compiler));
  }

  app.use('/api', api);

  app.get('*', (_, res) => res.render('index'));

  serverInit(app, config);
  return app;
};
