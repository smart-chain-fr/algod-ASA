const createAccount = require("./createAccount")
const createASA = require("./createASA")

async function main() {
    let account = createAccount.createAccount(); 
    console.log(account)

    let sk = "curious approve soup whale usage correct bunker smoke brisk nut capital rabbit custom all dial funny autumn concert spatial life copy gallery grass absent vacant"
    let newASA = await createASA.createASA(sk, "SwordArtOrigin", "SAO", 100000, 1, "website");
    console.log(newASA)
}

main()
 