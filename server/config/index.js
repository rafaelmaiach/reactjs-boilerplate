const {
  NODE_ENV,
  PORT,
} = process.env;

module.exports = {
  env: NODE_ENV || 'development',
  port: PORT || 8080,
};
