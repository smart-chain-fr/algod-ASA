const saveImg = require("./saveImg");
const sendALGO = require("./sendALGO");
const config = require('./config/config.js')
const algosdk = require('algosdk')
const utils = require('./utils')


async function saveUrl(secret_key,filename){
    const algodToken = config.ALGOD_TOKEN;
    const algodServer = config.ALGOD_SERVER; 
    const algodPort = config.ALGOD_PORT;
    const sender = algosdk.mnemonicToSecretKey(secret_key)
    let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    let url = await saveImg.saveIpfs(filename)
    console.log(url)
    var enc = new TextEncoder()
    //const url2 = Uint8Array.from(Buffer.from(url, 'hex'));
    let url2 = enc.encode(url)
    let saveUrl = await sendALGO.sendALGO(secret_key,sender.addr,0,url2).catch(e=>{console.log(e)})
    const txn = saveUrl.signTxn(sender.sk)
    let tx = await algodclient.sendRawTransaction(txn).do();
    let confirmedTxn = await utils.waitForConfirmation(algodclient, tx.txId, 3);
        return {
            "txId":tx.txId,
            "confirmed round":confirmedTxn['confirmed-round']
        }
}

module.exports={
    saveUrl,
}