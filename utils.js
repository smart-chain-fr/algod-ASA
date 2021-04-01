const config = require('./config/config.js');

/**
 * Ensure that all of the required environment variables are set, throws an error otherwise
 * @param {string[]} list
 */
function ensureEnvVariablesSet(list) {
  list.forEach((envVarName) => {
    // Throw an error if the variable is not defined
    if (typeof config[envVarName] !== 'string') {
      throw new Error(`"${envVarName}" environment variable not set. Maybe you have to export NODE_ENV`)
    }
  })
}

/**
 * Read the base configuration from environment variables.
 * Returns:
 * - Algod Instance
 * - Sender Account
 * - Receiver Account
 */
function retrieveBaseConfig() {
  // check that environment variables are set
  ensureEnvVariablesSet([
    'ALGOD_TOKEN',
    'ALGOD_SERVER',
    'ALGOD_PORT'
  ])
}

module.exports = {
    retrieveBaseConfig,
  }