// log4js: https://github.com/log4js-node/log4js-node
// docs: https://log4js-node.github.io/log4js-node/index.html
const log4js = require('log4js');

const DEFAULT_LEVEL = 'debug';

const defaultLogger = log4js.getLogger();
defaultLogger.level = DEFAULT_LEVEL;

module.exports = (level = DEFAULT_LEVEL) => {
  if (level === DEFAULT_LEVEL) {
    return defaultLogger;
  }
  const logger = log4js.getLogger();
  logger.level = level;
  return logger;
};
