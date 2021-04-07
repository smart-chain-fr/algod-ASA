const config = require('./config/config.js')
const algosdk = require('algosdk')
const utils = require('./utils')

/**
  * send ALGO to specified user 
  * @param {string} send - sender's mnemonic
  * @param {string} receiver - receiver's address
  * @param {number} amount - amount of ALGO 
  * @returns transaction hash and the round the transaction has been confirmed
  */
async function sendALGO(send, receiver, amount) {
    if (argumentsVerification(send, receiver, amount) === 1) {
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
        const sender = algosdk.mnemonicToSecretKey(send);
        if (!algosdk.isValidAddress(sender.addr)){
            console.log("Error : Bad secret_key");
            return 
        }

        // we don't want to add any extra data to the tx so undefined
        let note = undefined;

        // Define params
        let params = await algodclient.getTransactionParams().do();
        // comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;
        let txn = algosdk.makePaymentTxnWithSuggestedParams(sender.addr, receiver, amount, undefined, note, params);        
        //sign the transaction
        let signedTxn = txn.signTxn(sender.sk);
        //submit the transaction
        let tx = await algodclient.sendRawTransaction(signedTxn).do();
        // Wait for confirmation
        let confirmedTxn = await utils.waitForConfirmation(algodclient, tx.txId, 3);

        return {
            "txId": tx.txId,
            "confirmed round": confirmedTxn['confirmed-round']
        }
    }
}

function argumentsVerification(sender, receiver, amount, assetID){
    if (
        typeof sender == 'string' && 
        typeof receiver == 'string' && 
        typeof amount == 'number'
    ){
        return 1
    }
    console.log("Error : Bad Arguments")
    return 0
}


module.exports = {
    sendALGO,
};
