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


async function waitForConfirmation (algodclient, txId, timeout) {
  /**
  * utility function to wait on a transaction to be confirmed
  * the timeout parameter indicates how many rounds do you wish to check pending transactions for
  * @param {string} txId - the transaction to wait for
  * @param timeout(int) - maximum number of rounds to wait
  * @returns pending transaction information, or throws an error if the transaction is not confirmed or rejected in the next timeout rounds
  */
      
  if (algodclient == null || txId == null || timeout < 0) {
      throw "Bad arguments.";
  }

  let status = (await algodclient.status().do());
  if (status == undefined) throw new Error("Unable to get node status");
  let startround = status["last-round"] + 1;
  let currentround = startround;

  while (currentround < (startround + timeout)) {
      let pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
      if (pendingInfo != undefined) {
          if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
              // Got the completed Transaction
              return pendingInfo;
          }
          else {
              if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                  // If there was a pool error, then the transaction has been rejected!
                  throw new Error("Transaction Rejected" + " pool error" + pendingInfo["pool-error"]);
              }
          }
      }
      await algodclient.statusAfterBlock(currentround).do();
      currentround++;
  }
  throw new Error("Transaction not confirmed after " + timeout + " rounds!");
};

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

/**
  * utility function to check if a user has already owned this token and therefore is already opted in
  * @param {string} address - address of the user we want to check
  * @param assetID(int) - ID of the asset we want to check
  * @returns returns true if already opted in returns undefined if not
  */
async function isAlreadyOptedIn(algodclient,address,assetID){
  let accountInfo = await algodclient.accountInformation(address).do();
  for (var asset of accountInfo.assets){
    if (asset['asset-id']===assetID){
      return true;
    }
  }
}

module.exports = {
    retrieveBaseConfig,
    waitForConfirmation,
    isAlreadyOptedIn,
  }