const config = require('./config/config.js');
const algosdk = require('algosdk');
const utils = require('./utils');

// Transfer New Asset:
// we can tranfer tokens in from the creator
// to another account

const algodToken = config.ALGOD_TOKEN;
const algodServer = config.ALGOD_SERVER; 
const algodPort = config.ALGOD_PORT;

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

async function SendASA(sender,receiver,AssetID,amount) {
        
        const send = algosdk.mnemonicToSecretKey(sender);
        console.log("danny addr : ",send.addr);
        const receiv =  algosdk.mnemonicToSecretKey(receiver);
        console.log("Bay addr : ",receiv.addr);
        revocationTarget = undefined;
        closeRemainderTo = undefined;
        note= undefined;

        params = await algodclient.getTransactionParams().do();
         //comment out the next two lines to use suggested fee
        params.fee = 1000;
        params.flatFee = true;

        // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
        let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(send, receiv, closeRemainderTo, revocationTarget,
                amount, note, AssetID, params);

        // Must be signed by the account sending the asset  
        rawSignedTxn = xtxn.signTxn(send.sk)
        let xtx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
        console.log("Transaction : " + xtx.txId);



        // wait for transaction to be confirmed
        await waitForConfirmation(algodclient, xtx.txId);

        // You should now see the 10 assets listed in the account information
        console.log("Bay's Account  = " + receiv.addr);
        
}SendASA("curious approve soup whale usage correct bunker smoke brisk nut capital rabbit custom all dial funny autumn concert spatial life copy gallery grass absent vacant","exchange fat eye height amused peasant bread snap state author warm combine sock long quarter balance travel true stove bicycle else remind vendor absorb laugh",14964045,1234).catch(e => {
        console.log(e);    
});


async function waitForConfirmation (algodclient, txId, timeout) {
        /**
        * utility function to wait on a transaction to be confirmed
        * the timeout parameter indicates how many rounds do you wish to check pending transactions for
        * @pa //comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true;ram {string} txId - the transaction to wait for
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