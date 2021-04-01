const algosdk = require('algosdk');
const utils = require('./utils');

const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const server = "http://localhost";
const port = 4001;
// Import the filesystem module 
const fs = require('fs'); 

const { SENDER } = utils.retrieveBaseConfig();
const myAccount = algosdk.mnemonicToSecretKey(SENDER.mnemonic);

console.log("My Address: " + myAccount.addr);




// Function used to wait for a tx confirmation
const waitForConfirmation = async function (algodclient, txId) {
    let response = await algodclient.status().do();
    let lastround = response["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            //Got the completed Transaction
            console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            break;
        }
        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
};
// create an algod v2 client
let algodclient = new algosdk.Algodv2(token, server, port);

(async () => {

    // get suggested parameter
    let params = await algodclient.getTransactionParams().do();
    // comment out the next two lines to use suggested fee 
    params.fee = 1000;
    params.flatFee = true;

    console.log(params);
    // create logic sig
    // samplearg.teal
    // This code is meant for learning purposes only
    // It should not be used in production
    // arg_0
    // btoi
    // int 123
    // ==
    // see more info here: https://developer.algorand.org/docs/features/asc1/sdks/#accessing-teal-program-from-sdks


    var fs = require('fs'),
        path = require('path'),
        
        filePath = path.join(__dirname, 'sendingTokens.teal');
        console.log(filePath);

    // filePath = path.join(__dirname, <'fileName'>);
    let data = fs.readFileSync(filePath);
    console.log("data :" + data);

    // Compile teal
    let results = await algodclient.compile(data).do();
    // Print results
    console.log("Hash = " + results.hash);
    console.log("Result = " + results.result);
    


    // let program = new Uint8Array(Buffer.from(<"base64-encoded-program">, "base64"));
    let program = new Uint8Array(Buffer.from(results.result, "base64"));
    // Use this if no args
    // let lsig = algosdk.makeLogicSig(program);


    // String parameter
    // let args = ["<my string>"];
    // let lsig = algosdk.makeLogicSig(program, args);
    //let args = [[123]];
    let lsig = algosdk.makeLogicSig(program);


    // sign the logic signature with an account sk
    lsig.sign(myAccount.sk);
    


    // Setup a transaction
    let sender = myAccount.addr;
    let receiver = "QWMVCM5IXQCIM7SETMZWV3IIW5N7GPBYAUW7GH5NVTPCUTB23I2ES5CC3M";
    // let receiver = "<receiver-address>"";
    let amount = 10000;
    let closeToRemaninder = undefined;
    let note = undefined;
    let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, closeToRemaninder, note, params)

    // Create the LogicSigTransaction with contract account LogicSig
    let rawSignedTxn = algosdk.signLogicSigTransactionObject(txn, lsig);

    console.log("to debug");

    // fs.writeFileSync("simple.stxn", rawSignedTxn.blob);
    // send raw LogicSigTransaction to network    
    let tx = (await algodclient.sendRawTransaction(rawSignedTxn.blob).do());




    console.log("Transaction : " + tx.txId);    
    await waitForConfirmation(algodclient, tx.txId);

})().catch(e => {
    console.log(e.body.message);
    console.log(e);
});
