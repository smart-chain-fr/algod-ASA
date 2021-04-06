const createAccount = require("./createAccount");
const createASA = require("./createASA");
const Optin = require("./optin")

async function main() {
    let account = createAccount.createAccount(); 
    console.log(account)

    //use your mnemonic
    let sk = "exchange fat eye height amused peasant bread snap state author warm combine sock long quarter balance travel true stove bicycle else remind vendor absorb laugh"
    let newASA = await createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
    console.log(newASA)

    const AssetId = 15104421;
    let OptAsa = await Optin.Optin(sk,AssetId);
    console.log(OptAsa)
}

main()
 