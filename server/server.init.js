const http = require('http');
const path = require('path');
const fs = require('fs');

const logger = require('./logger')();

module.exports = (app, config) => {
  http
    .createServer(app)
    .listen(config.port, () => logger.info(`Server running on ${config.env} mode at ${config.port}`));
};
