const http = require('http');

const logger = require('./logger')();

module.exports = (app, config) => {
  http
    .createServer(app)
    .listen(config.port, () => logger.info(`Server running on ${config.env} mode at ${config.port}`));
};
