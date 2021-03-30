// config.js
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
   path: path.resolve(__dirname, process.env.NODE_ENV +'.env')
}); 


module.exports = {
    
    // Algod Instance
    ALGOD_TOKEN:process.env.ALGOD_TOKEN,
    ALGOD_SERVER:process.env.ALGOD_SERVER,
    ALGOD_PORT:process.env.ALGOD_PORT,

    // Sender Account
    SENDER_MNEMONIC:process.env.SENDER_MNEMONIC,

    // Receiver
    RECEIVER_MNEMONIC:process.env.RECEIVER_MNEMONIC

}