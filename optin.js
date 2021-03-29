
const algosdk = require('algosdk');
const utils = require('./utils');

const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = 4001;

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


const { SENDER } = utils.retrieveBaseConfig();
//const sender = algosdk.mnemonicToSecretKey(SENDER.mnemonic);
const sender = algosdk.mnemonicToSecretKey("tape galaxy sign trade impose panther tone holiday test swallow social bargain pave speak skin decrease crater once mammal mail stool kit wolf abandon husband");


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

(async () => {

    params = await algodclient.getTransactionParams().do();
    //comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true;

    let note = undefined; // arbitrary data to be stored in the transaction; here, none is stored


    let assetID = 37
    let senderAddress = sender.addr;
    let recipient = sender.addr;
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
    rawSignedTxn = opttxn.signTxn(sender.sk);



    let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
    console.log("Transaction : " + opttx.txId);

})().catch(e => {
    console.log(e);
});
