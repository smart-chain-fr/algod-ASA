const Optin = require("./optin")
const sendASA = require('./sendASA')
const sendALGO = require('./sendALGO')
const algosdk = require('algosdk')
const config = require('./config/config.js');
const utils = require('./utils');
const { mnemonicToSecretKey } = require("algosdk");

/**
  * Creates an atomic transfer which will send algos, opt in and send asa to a specified user 
  * @param {string} secret_key - our mnemonic
  * @param {string} receiver - customer's account
  * @param {number} assetId - id of the asa
  * @param {number} amountASA - amount of ASA 
  * @returns transaction hash and the round the transaction has been confirmed
  */
async function atomic(secret_key, receiver,assetId, amountASA) {
    if (argumentsVerification(secret_key, receiver,assetId, amountASA) === 1) {
        try {
            utils.retrieveBaseConfig()
        } catch (e) {
            console.error(e)
            return
        }
        const algodToken = config.ALGOD_TOKEN;
        const algodServer = config.ALGOD_SERVER; 
        const algodPort = config.ALGOD_PORT;
        
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
        
        // Array of transactions for the atomic transfer
        let transactions =[]

        // Creates the 1st transaction. It has to be first because the user needs algo to opt in
        let sendAlgo=await sendALGO.sendALGO(secret_key,receiver.address,201000)
        // Adds it to the array
        transactions.push(sendAlgo)

        // Creates the 2nd transaction (input is the customer's mnemonic because he has to opt himself in)
        let optin = await Optin.Optin(receiver.secret_key,assetId);
        // If the user is already opted we don't append the transaction
        if (optin){
            transactions.push(optin)
        }    

        // Creates the 3rd transaction sending him the asa
        let sendAsa=await sendASA.SendASA(secret_key,receiver.address,assetId,amountASA)
        // Adds it to the array
        transactions.push(sendAsa)

        // Assigns an id to the transactions
        let txgroup = algosdk.assignGroupID(transactions)

        // Getting our secret key to sign the algo transaction and the asa transaction
        const acc = algosdk.mnemonicToSecretKey(secret_key);

        // Signed transactions array
        let signed = []
        
        // Sign the algo transaction
        signed.push(txgroup[0].signTxn(acc.sk))

        // Signing the opt in with the customers key
        signed.push(txgroup[1].signTxn(mnemonicToSecretKey(receiver.secret_key).sk))

        // Sign the asa transaction
        signed.push(txgroup[2].signTxn(acc.sk))

        // Broadcast the transactions
        let tx = (await algodClient.sendRawTransaction(signed).do());

        // Wait for confirmation and displays it
        let confirmedTransaction = await utils.waitForConfirmation(algodClient, tx.txId,3) 

        // assign an id to every transaction
        return {
            "txId":tx.txId,
            "confirmed round":confirmedTransaction['confirmed-round']
        }
    }    
}

function argumentsVerification(secret_key, receiver,assetId, amountASA){
    if (
        typeof secret_key === 'string' &&
        typeof receiver === 'object' &&
        typeof assetId === 'number' &&
        typeof amountASA === 'number'
    ){
        return 1
    }
    console.log("Error : Bad Arguments")
    return 0
}

module.exports = {
    atomic,
};