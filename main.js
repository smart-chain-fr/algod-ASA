const createAccount = require("./createAccount")
const createASA = require("./createASA")

async function main() {
    let account = createAccount.createAccount(); 
    console.log(account)

    let sk = ""
    let newASA = await createASA.createASA(sk, "", "", 0, 0, "");
    console.log(newASA)
}

main()
 