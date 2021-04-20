const config = require('./config/config.js')
const algosdk = require('algosdk')
const utils = require('./utils')

/**
  * creates a transaction to send ALGO to specified user 
  * @param {string} send - sender's mnemonic
  * @param {string} receiver - receiver's address
  * @param {number} amount - amount of ALGO 
  * @returns the unsigned transaction
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


        // Define params
        let params = await algodclient.getTransactionParams().do();
        params.fee = 1000;
        params.flatFee = true;
        let note = undefined;
        return algosdk.makePaymentTxnWithSuggestedParams(sender.addr, receiver, amount, undefined, note, params);        
    }
}

function argumentsVerification(sender, receiver, amount){
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
