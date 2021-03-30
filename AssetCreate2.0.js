


const config = require('./config/config.js');
const algosdk = require('algosdk');
const utils = require('./utils');

const algodToken = config.ALGOD_TOKEN;
const algodServer = config.ALGOD_SERVER;
const algodPort = config.ALGOD_PORT;

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


const { SENDER } = utils.retrieveBaseConfig();

/**
 * Create an asset 
 * @param {string} AddressCreator - address of the account that create the asset
 * @param totalT - how many of this asset it will be availaible
 * @param decimalsT -  units of this asset are whole-integer amounts
 * @param assetNameT - token name
 * @param unitnameT - shorten asset name
 * @param urlS - website url
 * @return {string} Asset ID and the Transaction ID in output
*/
async function createAsset( AddressCreator,totalT ,decimalsT,assetNameT,unitnameT,urlS ) {
    const sender = algosdk.mnemonicToSecretKey(SENDER.mnemonic);

    const { addr: freezeAddr } = "";// account that can freeze other accounts for this asset
    const { addr: managerAddr } = AddressCreator ;// account able to update asset configuration
    const { addr: clawbackAddr } = ""; // account allowed to take this asset from any other account
    const { addr: reserveAddr } = "";// account that holds reserves for this asset

    const feePerByte = 10;

    const params = await algodclient.getTransactionParams().do();


    const firstValidRound = params['firstRound'];
    const lastValidRound = params['lastRound'];
    const genesisHash = params['genesisHash'];

    const total = totalT;
    const decimals = decimalsT; 
    const assetName = assetNameT; 
    const unitName = unitnameT; 
    const url = urlS;
    const metadata = new Uint8Array(//je doit remplir ou pas  r&d regarder 
        Buffer.from(
            '664143504f346e52674f35356a316e64414b3357365367633441506b63794668',
            'hex'
        )
    ); // should be a 32-byte hash
    const defaultFrozen = false; // whether accounts should be frozen by default

    // create suggested parameters
    const suggestedParams = {
        flatFee: false,
        fee: feePerByte,
        firstRound: firstValidRound,
        lastRound: lastValidRound,
        genesisHash,
    };

    // create the asset creation transaction
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: url,
        assetMetadataHash: metadata,
        defaultFrozen,

        freeze: freezeAddr,
        manager: managerAddr,
        clawback: clawbackAddr,
        reserve: reserveAddr,

        suggestedParams,
    });
    

    // sign the transaction
    const signedTxn = txn.signTxn(sender.sk);

    // print transaction data
    const decoded = algosdk.decodeSignedTransaction(signedTxn);

    let txId = txn.txID().toString();

    //submit the transaction
    await algodclient.sendRawTransaction(signedTxn).do();

     /**
     * utility function to wait on a transaction to be confirmed
     * the timeout parameter indicates how many rounds do you wish to check pending transactions for
     * @param {string} txId - the transaction to wait for
     * @param timeout(int) - maximum number of rounds to wait
     * @returns pending transaction information, or throws an error if the transaction is not confirmed or rejected in the next timeout rounds
     */
      const waitForConfirmation = async function (algodclient, txId, timeout) {
          
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
    let confirmedTxn = await waitForConfirmation(algodclient, txId, 3);
    //Get the completed Transaction
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);



    // Get the new asset's information from the creator account
    let ptx = await algodclient.pendingTransactionInformation(txId).do();
    assetID = ptx["asset-index"];
    console.log("AssetID = " + assetID);

}
createAsset().catch(console.error);

module.exports = {
    createAsset
}