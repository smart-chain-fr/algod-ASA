const config = require('../config/config.js')
const algosdk = require('algosdk')
const utils = require('../util/utils')


/**
 * Creates a transaction to receive new ASA 
 * @param {string} secret_key - memonic of the sender 
 * @param {string} assetID - token ID
 * @return {Object} Unsigned transaction
*/
async function Optin(secret_key,assetID) {


    if(argumentsVerification (secret_key,assetID) === 1){

        try {
            utils.retrieveBaseConfig()
        } catch (e) {
            console.error(e)
            return
        }

        const algodToken = config.ALGOD_TOKEN;
        const algodServer = config.ALGOD_SERVER; 
        const algodPort = config.ALGOD_PORT;
        
        let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
        
        // Account recovery 
        const targetAcc = algosdk.mnemonicToSecretKey(secret_key);
        if (!algosdk.isValidAddress(targetAcc.addr)){
            console.log("Error : Bad secret_key")
            return 
        }
        // Checks if user has already owned this asset
        if (await utils.isAlreadyOptedIn(algodclient,targetAcc.addr,assetID)){
            console.log("Already opted in for this token")
            return 
        }
        // Define params
        params = await algodclient.getTransactionParams().do();
        //comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;

        // arbitrary data to be stored in the transaction; here, none is stored
        let note = undefined; 

        // We set revocationTarget to undefined as this is not a clawback operation
        let revocationTarget = undefined;

        // CloseReaminerTo is set to undefined as we are not closing out an asset
        let closeRemainderTo = undefined;
        
        // We are sending 0 assets
        amount = 0;

        // signing and sending "txn" allows sender to receive asset specified by creator and index
        return algosdk.makeAssetTransferTxnWithSuggestedParams(targetAcc.addr, targetAcc.addr, closeRemainderTo, revocationTarget,
            amount, note, assetID, params);
    }
 
}

function argumentsVerification(secret_key,assetID){
    if (
        typeof secret_key === 'string' &&  
        typeof assetID === 'number'
    ){
        return 1
    }

    console.log("Error : Bad Arguments")
    return 0
}


module.exports = {
    Optin,
};
