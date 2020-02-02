/* eslint-disable global-require */
const path = require('path');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');


const webpackConfiguration = (env) => {
  const isProductionEnv = env.NODE_ENV === 'production';
  const isBundleAnalyze = env.BUNDLE_ANALYZE === 'true';

  const defaultConfig = {
    module: {
      rules: [
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          use: 'file-loader',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10 * 1024,
                noquotes: true,
              },
            },
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|ico)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024,
              },
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  enabled: true,
                  progressive: true,
                },
                gifsicle: {
                  interlaced: false,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new WebpackBar(),
    ],
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
        '@': path.resolve(__dirname, 'src'),
        '@actions': path.resolve(__dirname, 'src', 'actions'),
        '@reducers': path.resolve(__dirname, 'src', 'reducers'),
        '@store': path.resolve(__dirname, 'src', 'store'),
      },
    },
  };

  let webpackConfig = null;

  if (isProductionEnv) {
    const prodOptions = require('./webpack.prod');
    const prodConfig = merge(defaultConfig, prodOptions);
    webpackConfig = prodConfig;

    if (isBundleAnalyze) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      webpackConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../report.html',
        openAnalyzer: false,
      }));
    }
  } else {
    const devOptions = require('./webpack.dev');
    const devConfig = merge(defaultConfig, devOptions);
    webpackConfig = devConfig;
  }

  return webpackConfig;
};

module.exports = webpackConfiguration;
