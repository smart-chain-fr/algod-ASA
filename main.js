const createAccount = require("./createAccount")
const createASA = require("./createASA")

async function main() {
    let account = createAccount.createAccount(); 
    console.log(account)

    let sk = "wrestle damage abandon notice exist jar kingdom say hand ship produce current ecology camp nerve crack fantasy coast vendor resist major stand struggle absorb total"
    let newASA = await createASA.createASA(sk, "Test", "TST", 100000, 2, "test.com");
    console.log(newASA)
}

main()
 