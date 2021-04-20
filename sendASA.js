const config = require('./config/config.js');
const algosdk = require('algosdk');
const utils = require('./utils');

/**
  * Creates a transaction to send the specified ASA to the specified user 
  * @param {string} send - sender's mnemonic
  * @param {string} receiver - receiver's address
  * @param assetID(int) - ID of the ASA to be sent
  * @param amount(int) - amount of ASA
  * @returns unsigned transaction
  */
async function SendASA(send,receiver,assetID,amount) {
    if (argumentsVerification(send, receiver, amount, assetID) === 1) {
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
        const sender = algosdk.mnemonicToSecretKey(send);
        if (!algosdk.isValidAddress(sender.addr)){
            console.log("Error : Bad secret_key");
            return 
        }
        // we don't want to add any extra data to the tx so undefined
        note= undefined;

        // Define params
        revocationTarget = undefined;
        closeRemainderTo = undefined;
        params = await algodclient.getTransactionParams().do();
        //comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;
        
        return await algosdk.makeAssetTransferTxnWithSuggestedParams(sender.addr, receiver, closeRemainderTo, revocationTarget,
            amount, note, assetID, params);
    }
        
}
function argumentsVerification(sender, receiver, amount, assetID){
    if (
        typeof sender == 'string' && 
        typeof receiver == 'string' && 
        typeof amount == 'number' &&
        typeof assetID == 'number'
    ){
        return 1
    }
    console.log("Error : Bad Arguments")
    return 0
}

module.exports = {
    SendASA,
};


