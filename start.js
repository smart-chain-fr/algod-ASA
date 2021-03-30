const algosdk = require('algosdk');

const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = 4001;

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


//Check node status
(async () => {
    console.log(await algodclient.status().do());
})().catch(e => {
    console.log(e);
});


//Check suggested transaction parameters
(async () => {
    console.log(await algodclient.getTransactionParams().do());
})().catch(e => {
    console.log(e);
});




const passphrase = "okay immense monitor install seat tenant knife stomach bread acoustic plate tail bamboo bounce april black scatter rule interest dove double gesture stereo about thrive";

let myAccount = algosdk.mnemonicToSecretKey(passphrase);
console.log("My address: %s", myAccount.addr);



// (async () => {
//     let accountInfo = (await algodclient.accountInformation(myAccount.addr).do());
//     console.log("Account balance: %d microAlgos", accountInfo.amount);
// })().catch(e => {
//     console.log(e);
// });




//information account
(async () => {
    
    let account_info = (await algodclient.accountInformation(myAccount.addr).do());
    let acct_string = JSON.stringify(account_info);
    //console.log("Account Info: " + acct_string + "\n");
    
    console.log("Address: " + account_info.address); 
    console.log("Amount: " + account_info.amount);


})().catch(e => {
    console.log(e);
});



//send 1 Algo to the sink
(async () => {
    let params = await algodclient.getTransactionParams().do();
    // comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true;
    const receiver = "Q4U6M24HL6JQBXHH63JJIIVLXRXNWZBRJHQNAR6GEURACNIRZFZ4UACMAY";
    let note = algosdk.encodeObj("Hello World");
    let txn = algosdk.makePaymentTxnWithSuggestedParams(myAccount.addr, receiver, 1000000, undefined, note, params);        
    //sign the transaction
    let signedTxn = txn.signTxn(myAccount.sk);
    let txId = txn.txID().toString();
    console.log("Signed transaction with txID: %s", txId);
    //submit the transaction
    await algodclient.sendRawTransaction(signedTxn).do();


    /**
     * utility function to wait on a transaction to be confirmed
     * the timeout parameter indicates how many rounds do you wish to check pending transactions for
     */
    const waitForConfirmation = async function (algodclient, txId, timeout) {
        // Wait until the transaction is confirmed or rejected, or until 'timeout'
        // number of rounds have passed.
        //     Args:
        // txId(str): the transaction to wait for
        // timeout(int): maximum number of rounds to wait
        // Returns:
        // pending transaction information, or throws an error if the transaction
        // is not confirmed or rejected in the next timeout rounds
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
                    //Got the completed Transaction
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




    // Wait for confirmation
    let confirmedTxn = await waitForConfirmation(algodclient, txId, 4);
    //Get the completed Transaction
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
    console.log("Transaction information: %o", mytxinfo);
    var string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
    console.log("Note field: ", string);
})().catch(e => {
    console.log(e);
});
