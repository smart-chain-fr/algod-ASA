const createAccount = require("./createAccount");
const createASA = require("./createASA");
const Optin = require("./optin")
const sendASA = require('./sendASA')
const sendALGO = require('./sendALGO')
const atomic = require('./atomic')

async function main() {
    let account = createAccount.createAccount(); 
    console.log("account ",account)

    //use your mnemonic
    let sk = "rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious"
    let newASA = await createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
    console.log("new ASA ",newASA)

    let atomicTransfer = await atomic.atomic(sk,account,newASA.ASA_ID,10,300000)
    console.log("atomic transfer ",atomicTransfer)
}

main()
 