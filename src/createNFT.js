const config = require('../config/config.js');
const algosdk = require('algosdk');
const utils = require('../util/utils')
const { makeAssetCreateTxnWithSuggestedParamsFromObject } = require('algosdk');

/**
 * Creates a NFT
 * @param {string} secret_key - memonic of the sender 
 * @param {string} assetName - NFT name
 * @param {string} unitName - symbol of the NFT
 * @param {string} cid - id file ipfs 
 * @return {Object} NFT ID / Transaction ID / confirmed round
*/
async function createNFT(secret_key, assetName, unitName, cid) {

    if(argumentsVerification(secret_key, assetName, unitName, cid) === 1){

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
        const sender = algosdk.mnemonicToSecretKey(secret_key)
        if (!algosdk.isValidAddress(sender.addr)){
            console.log("Error : Bad secret_key")
            return 
        }
    
        // Define params
        const suggestedParams = await algodclient.getTransactionParams().do();
        total = 1
        decimals = 0

        // Separation of the CID
        // 1st half in the metadata hash
        const assetMetadataHash = cid.slice(0,32)
        // 2nd half in the cid field
        const assetURL = cid.slice(32,cid.length)
        // Create the asset creation transaction
        const txn = makeAssetCreateTxnWithSuggestedParamsFromObject({
    
            suggestedParams,
            from: sender.addr, 
            manager: sender.addr,
            assetMetadataHash,
            total,
            decimals,
            assetName,
            unitName,
            assetURL
        })
        
        // Sign the transaction
        const signedTxn = txn.signTxn(sender.sk);

        // Submit the transaction
        let tx = await algodclient.sendRawTransaction(signedTxn).do().catch(e=>{console.log(e)});
    
        // Wait for confirmation
        let confirmedTxn = await utils.waitForConfirmation(algodclient, tx.txId, 3)
        // console.log("Transaction : " + tx.txId + "\nConfirmed in round " + confirmedTxn["confirmed-round"]);
    
        // Get the ASA-ID 
        let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
        NFT_ID = ptx["asset-index"];
        //console.log("NFT_ID = " + NFT_ID);
    
        return {
            "txId": tx.txId, 
            "NFT_ID": NFT_ID,
            "confirmed round": confirmedTxn['confirmed-round']
        }
    }
}

function argumentsVerification(secret_key, assetName, unitName,cid){
    if (
        typeof secret_key === 'string' && 
        typeof assetName === 'string' && 
        typeof unitName === 'string' && 
        typeof cid === 'string'
    ){
        return 1
    }
    console.log("Error : Bad Arguments")
    return 0
}

module.exports = {
    createNFT,
};