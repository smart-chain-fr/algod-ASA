const config = require('./config/config.js')
const algosdk = require('algosdk')
const utils = require('./utils')

const algodToken = config.ALGOD_TOKEN;
const algodServer = config.ALGOD_SERVER; 
const algodPort = config.ALGOD_PORT;

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


//const { SENDER } = utils.retrieveBaseConfig();
//const sender = algosdk.mnemonicToSecretKey(SENDER.mnemonic);
//put your own mnemonic key below
//const sender = algosdk.mnemonicToSecretKey("curious approve soup whale usage correct bunker smoke brisk nut capital rabbit custom all dial funny autumn concert spatial life copy gallery grass absent vacant");


// Opting in to an Asset:
// Opting in to transact with the new asset
// Allow accounts that want recieve the new asset
// Have to opt in. To do this they send an asset transfer
// of the new asset to themseleves 
// In this example we are setting up the 3rd recovered account to 
// receive the new asset

// First update changing transaction parameters
// We will account for changing transaction parameters
// before every transaction in this example
function argumentsVerification(Myaccount,assetID){
    if (
        typeof Myaccount == 'string' &&  
        typeof assetID == 'number'
    ){
        return 1
    }

    console.log("Error : Bad Arguments")
    return 0
}

//(async () => {
async function Optin(Myaccount,assetID) {


    if(argumentsVerification (Myaccount,assetID) == 1){

        try {
            utils.retrieveBaseConfig()
        } catch (e) {
            console.error(e)
            return
        }
           //ajout
    const Myacc = algosdk.mnemonicToSecretKey(Myaccount);

    params = await algodclient.getTransactionParams().do();
    //comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true;

    let note = undefined; // arbitrary data to be stored in the transaction; here, none is stored

    //asset id from your wallet
    //let assetID = 15099374;
    let senderAddress = Myacc.addr;
    //let recipient = recev.addr;
    recipient = senderAddress;
    // We set revocationTarget to undefined as 
    // This is not a clawback operation
    let revocationTarget = undefined;
    // CloseReaminerTo is set to undefined as
    // we are not closing out an asset
    let closeRemainderTo = undefined;
    // We are sending 0 assets
    amount = 0;



    // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(senderAddress, recipient, closeRemainderTo, revocationTarget,
            amount, note, assetID, params);

    // Must be signed by the account wishing to opt in to the asset    
    rawSignedTxn = opttxn.signTxn(Myacc.sk);

    let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
    return {
        "OpttxId": opttx.txId
    }

    }
 
}
module.exports = {
    Optin,
};