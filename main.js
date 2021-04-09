const createAccount = require("./createAccount");
const createASA = require("./createASA");
const atomic = require('./atomic')

async function main() {
    let account = createAccount.createAccount(); 
    console.log("account ",account)

<<<<<<< HEAD
    let sk = "wrestle damage abandon notice exist jar kingdom say hand ship produce current ecology camp nerve crack fantasy coast vendor resist major stand struggle absorb total"
    let newASA = await createASA.createASA(sk, "Test", "TST", 100000, 2, "test.com");
    console.log(newASA)
=======
    //use your mnemonic
    let sk = "rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious"
    let newASA = await createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
    console.log("new ASA ",newASA)

    let atomicTransfer = await atomic.atomic(sk,account,newASA.ASA_ID,10)
    console.log("atomic transfer ",atomicTransfer)
>>>>>>> dev
}

main()
 