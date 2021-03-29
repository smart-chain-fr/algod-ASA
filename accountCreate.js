

const algosdk = require('algosdk');



var acct = null;

acct = algosdk.generateAccount();

console.log("Account Address = " + acct.addr);
var acct_mnemonic = algosdk.secretKeyToMnemonic(acct.sk);
console.log("Account Mnemonic = "+ acct_mnemonic);
var recoveredAccount1 = algosdk.mnemonicToSecretKey(acct_mnemonic);
var isValid = algosdk.isValidAddress(recoveredAccount1.addr);
console.log("Is this a valid address: " + isValid);
console.log("Account created. Save off Mnemonic and address");