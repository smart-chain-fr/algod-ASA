

//const config = require('./config/config.js');
const algosdk = require('algosdk');
const utils = require('./utils');


// Creating an indexer


/* const indexer_token = "";
const indexer_server = "http://localhost";
const indexer_port = 8980;

const indexerClient = new algosdk.Indexer(indexer_token, indexer_server, indexer_port);
 */




// sandbox
//var environnement 
const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";//congif.ALGOD_TOKEN
const algodServer = "http://localhost";//config.ALGOD_SERVER
const algodPort = 4001;//config.ALGOD_PORT

let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);



const { SENDER } = utils.retrieveBaseConfig();

async function main(a) {
    const sender = algosdk.mnemonicToSecretKey(SENDER.mnemonic);
    //modifier 
    // generate accounts
    const { addr: freezeAddr } = ""; // account that can freeze other accounts for this asset
    const { addr: managerAddr } = algosdk.generateAccount(); // account able to update asset configuration
    const { addr: clawbackAddr } = ""; // account allowed to take this asset from any other account
    const { addr: reserveAddr } = ""; // account that holds reserves for this asset

    const feePerByte = 10;


    /* let status = await algodclient.status().do();
    if (status == undefined) throw new Error("Unable to get node status");
    var firstValidRound = status["last-round"] + 1;  
    var lastValidRound = firstValidRound + 1000; */

    const params = await algodclient.getTransactionParams().do();

    //const genesisHash = 'pXXY8psM8jgd8F/dUplcOGebnV50PFojR+YMRCtY/us=';

    const firstValidRound = params['firstRound'];
    const lastValidRound = params['lastRound'];
    const genesisHash = params['genesisHash'];

    //faire en sorte que ce soit passer dans la fonctions en signature //const non obligatoire
    const total = 100; // how many of this asset there will be
    const decimals = 0; // units of this asset are whole-integer amounts
    const assetName = 'assetname';
    const unitName = 'unitname';
    const url = 'website';//a mettre 
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
    //console.log(decoded);

    let txId = txn.txID().toString();
    //console.log("Signed transaction with txID: %s", txId);
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
        //uniformiser recuperer les variables comme la haut (1 si tu peu et 2 les récuperer)
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
    console.log("Transaction : " + txId + "\nConfirmed in round " + confirmedTxn["confirmed-round"]);



    // Get the new asset's information from the creator account
    let ptx = await algodclient.pendingTransactionInformation(txId).do();
    assetID = ptx["asset-index"];
    console.log("AssetID = " + assetID);

    console.log(a);
}

//main().catch(console.error);
module.exports = {
    main,
};