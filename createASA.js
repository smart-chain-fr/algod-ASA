const config = require('./config/config.js');
const algosdk = require('algosdk');


/**
 * Create an asset 
 * TODO : export NODE_ENV=source
 * @param {string} secret_key - memonic of the sender 
 * @param {string} assetName - token name
 * @param {string} unitName - symbol of the token 
 * @param {number} total - supply
 * @param {number} decimals - decimals
 * @param {string} assetURL - website url
 * @return {Object} Asset ID / Transaction ID 
*/
async function createASA(secret_key, assetName, unitName, total, decimals, assetURL) {

    if(argumentsVerification(secret_key, assetName, unitName, total, decimals, assetURL) == 1){

        const algodToken = config.ALGOD_TOKEN;
        const algodServer = config.ALGOD_SERVER; 
        const algodPort = config.ALGOD_PORT;

        let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort); 

        // Account recovery 
        const sender = algosdk.mnemonicToSecretKey(secret_key)
        if (!algosdk.isValidAddress(sender.addr)){
            console.log("Error : Bad secret_key")
            return 
        }
    
        // Define params
        const suggestedParams = await algodclient.getTransactionParams().do();
        const defaultFrozen = false; // whether accounts should be frozen by default
        total = Math.round(total)
        decimals = Math.round(decimals)
    
        // Create the asset creation transaction
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    
            suggestedParams,
            from: sender.addr, 
            manager: sender.addr,
            
            total,
            decimals,
            assetName,
            unitName,
            assetURL,
    
        });
        
        // Sign the transaction
        const signedTxn = txn.signTxn(sender.sk);
    
        // Submit the transaction
        let tx = await algodclient.sendRawTransaction(signedTxn).do();
    
        // Wait for confirmation
        let confirmedTxn = await waitForConfirmation(algodclient, tx.txId, 3);
        //console.log("Transaction : " + tx.txId + "\nConfirmed in round " + confirmedTxn["confirmed-round"]);
    
        // Get the ASA-ID 
        let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
        ASA_ID = ptx["asset-index"];
        //console.log("ASA_ID = " + ASA_ID);
    
        return {
            "txId": tx.txId, 
            "ASA_ID": ASA_ID
        }
    }
}

function argumentsVerification(secret_key, assetName, unitName, total, decimals, assetURL){
    if (
        typeof secret_key == 'string' && 
        typeof assetName == 'string' && 
        typeof unitName == 'string' && 
        typeof total == 'number' &&
        typeof decimals == 'number' && 
        typeof assetURL == 'string'
    ){
        if (decimals > 0 && decimals < 19) {
            return 1
        }
        
    }
    console.log("Error : Bad Arguments")
    return 0
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

module.exports = {
    createASA,
};






