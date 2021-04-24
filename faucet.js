const sendALGOwithTx = require ("./src/sendALGOwithTx")
const config = require('./config/config.js')

async function faucet (address, amount){
    let res = await sendALGOwithTx.sendALGO(config.FAUCET_ACCOUNT, address, amount);
    console.log(res)
}

faucet("C3BSNGCWXEE23WPXOXKS73U6O34OJTRGLE4SHDT765DAEN3C6D5FJSRNYA", 1) 






