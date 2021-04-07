const config = require('./config/config.js')
const algosdk = require('algosdk')
const utils = require('./utils')


/**
 * Optin : Allow Account to receive new ASA 
 * TODO : export NODE_ENV=source
 * @param {string} secret_key - memonic of the sender 
 * @param {string} assetID - token ID
 * @return {Object} Transaction ID 
*/
async function Optin(secret_key,assetID) {


    if(argumentsVerification (secret_key,assetID) == 1){

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
        let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(targetAcc.addr, targetAcc.addr, closeRemainderTo, revocationTarget,
                amount, note, assetID, params);

        // Must be signed by the account wishing to opt in to the asset    
        rawSignedTxn = opttxn.signTxn(targetAcc.sk);
        let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());

        // Wait for confirmation
        let confirmedTxn = await utils.waitForConfirmation(algodclient, opttx.txId,3);
        // console.log("Transaction : " + tx.txId + "\nConfirmed in round " + confirmedTxn["confirmed-round"]);
        
        return {
            "OptTxId": opttx.txId,
            "confirmed round": confirmedTxn['confirmed-round']
        }
    }
 
}

function argumentsVerification(secret_key,assetID){
    if (
        typeof secret_key == 'string' &&  
        typeof assetID == 'number'
    ){
        return 1
    }

    console.log("Error : Bad Arguments")
    return 0
}


module.exports = {
    Optin,
};