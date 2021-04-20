const algosdk = require('algosdk');

/**
  * Creates an new Account 
  * @returns {Object} the new Account : the address / the secret key
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