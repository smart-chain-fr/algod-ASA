const algosdk = require('algosdk');

const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = 4001;

let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


//Check node status
(async () => {
    console.log(await algodClient.status().do());
})().catch(e => {
    console.log(e);
});


//Check suggested transaction parameters
(async () => {
    console.log(await algodClient.getTransactionParams().do());
})().catch(e => {
    console.log(e);
});


//Create account on Algo
//var account = algosdk.generateAccount();
//var passphrase = algosdk.secretKeyToMnemonic(account.sk);
//console.log( "My address: " + account.addr );
//console.log( "My passphrase: " + passphrase );




const passphrase = "settle nominee cash crazy tenant build unfair emotion earth column canvas right pass harbor jungle resource wine ginger pyramid where buffalo object need abstract waste";

let myAccount = algosdk.mnemonicToSecretKey(passphrase);
console.log("My address: %s", myAccount.addr);



// (async () => {
//     let accountInfo = (await algodClient.accountInformation(myAccount.addr).do());
//     console.log("Account balance: %d microAlgos", accountInfo.amount);
// })().catch(e => {
//     console.log(e);
// });




// //create account
// let account = algosdk.generateAccount();
// console.log("Account Address: ", account.addr);

// let mn = algosdk.secretKeyToMnemonic(account.sk);
// console.log("Account Mnemonic: ", mn);


//information account
(async () => {
    
    let account_info = (await algodClient.accountInformation(myAccount.addr).do());
    let acct_string = JSON.stringify(account_info);
    //console.log("Account Info: " + acct_string + "\n");
    
    console.log("Address: " + account_info.address); 
    console.log("Amount: " + account_info.amount);


})().catch(e => {
    console.log(e);
});


