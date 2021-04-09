const createAccount = require("./createAccount");
const createASA = require("./createASA");
const atomic = require('./atomic')

async function main() {
    let account = createAccount.createAccount(); 
    console.log("account ",account)

    //use your mnemonic
    let sk = "rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious"
    let newASA = await createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
    console.log("new ASA ",newASA)

    let atomicTransfer = await atomic.atomic(sk,{secret_key:"rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious",address:"7IPIZ3JSB27EEWALVOPXX2DULZBSRRDCLOHHVM5P25HVXEXAK6Y34ROQPQ"},15148354,10)
    console.log("atomic transfer ",atomicTransfer)
}

main()
 