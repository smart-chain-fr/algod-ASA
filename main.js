const createAccount = require("./createAccount");
const createASA = require("./createASA");
const Optin = require("./optin")
const sendASA = require('./sendASA')
const sendALGO = require('./sendALGO')

async function main() {
    let account = createAccount.createAccount(); 
    console.log(account)

    //use your mnemonic
    let sk = "rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious"
    let newASA = await createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
    console.log(newASA)

    const AssetId = 15107527;
    let OptAsa = await Optin.Optin(sk,AssetId);
    console.log(OptAsa)
    let asaTx=await sendASA.SendASA(sk,"7IPIZ3JSB27EEWALVOPXX2DULZBSRRDCLOHHVM5P25HVXEXAK6Y34ROQPQ",AssetId,1234)
    console.log(asaTx)
    console.log(await sendALGO.sendALGO(sk,"7IPIZ3JSB27EEWALVOPXX2DULZBSRRDCLOHHVM5P25HVXEXAK6Y34ROQPQ",100))

}

main()
 