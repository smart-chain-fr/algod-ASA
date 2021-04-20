const algosdk = require('algosdk');
const config = require('./config/config.js');
const utils= require('./utils')
const algodToken = config.ALGOD_TOKEN;
const algodServer = config.ALGOD_SERVER; 
const algodPort = config.ALGOD_PORT;

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort); 

// Import the filesystem module 
const fs = require('fs'); 




(async () => {
    // get suggested parameters
    let params = await algodclient.getTransactionParams().do();
    // comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true;
    console.log(params);

    // create logic sig
    var fs = require('fs'),
        path = require('path'),
        filePath = path.join(__dirname, 'samplesss.teal');
        // filePath = path.join(__dirname, '<PLACEHOLDER>');       
    let data = fs.readFileSync(filePath);
    let results = await algodclient.compile(data).do();
    console.log("Hash = " + results.hash);
    console.log("Result = " + results.result);
    // let program = new Uint8Array(Buffer.from("base64-encoded-program" < PLACEHOLDER >, "base64"));
    let program = new Uint8Array(Buffer.from(results.result, "base64"));
    // Use this if no args
    //let lsig = algosdk.makeLogicSig(program);

    // String parameter
    // let args = [123];
    // let lsig = algosdk.makeLogicSig(program, args);
    // Integer parameter
    //const buffer = Buffer.alloc(8);
    //const bigIntValue = BigInt(123);
    //buffer.writeBigUInt64BE(bigIntValue)
    //let arg1 = Uint8Array.from(buffer);
    //let args = [algosdk.encodeUint64(123)];
    args = ["123"] //[new Uint8Array(Buffer.from("123", 'base64'))];
    console.log(args)
    let lsig = algosdk.makeLogicSig(program);
    //let args = [new Uint8Array([126])];
    console.log(program)
    //let lsig = algosdk.makeLogicSig(program, args);
    console.log("lsig : " + lsig.address());   

    // create a transaction
    let sender = lsig.address();
    let receiver = "GZO2IAG7QI5WVL4HWLLGPS4QADW2EPQVEZIGLFXCTYPYEKTHV2CNPUYNA4";
    let amount = 1;
    let closeToRemaninder = undefined;
    let note = undefined;
    console.log('sqdjdqlsdkjlqsdjlq', params)
    let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, closeToRemaninder, note, params)

    let rawSignedTxn = algosdk.signLogicSigTransactionObject(txn, lsig);

    // send raw LogicSigTransaction to network
    console.log('blob ', rawSignedTxn.blob)
    let tx = (await algodclient.sendRawTransaction(rawSignedTxn.blob).do().catch(e=>{console.log('HERE', e)}));
    console.log("Transaction : " + tx.txId);   
    console.log(await utils.waitForConfirmation(algodclient, tx.txId,3));

})().catch(e => {
    console.log('catch1', e);
});