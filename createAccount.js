const algosdk = require('algosdk');

/*
* - Function Create an Algorand Account 
* - No arguments 
* - Return Object {
*    "address": string, 
     "secret_key": string
*   }
*/

function createAccount(){
    let account = algosdk.generateAccount();
    let memonic = algosdk.secretKeyToMnemonic(account.sk);
    if(algosdk.isValidAddress(account.addr)){
        return {
            "address": account.addr, 
            "secret_key": memonic
        }
    }
    console.log("error during the creation of the wallet")

}

module.exports = {
    createAccount
}