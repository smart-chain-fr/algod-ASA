const createAccount = require("./createAccount");
const createASA = require("./createASA");
const atomic = require('./atomic')
const createNFT = require("./createNFT")


async function main() {
    let account = createAccount.createAccount(); 
    console.log("account ",account)

    //use your mnemonic
    let sk = "exchange fat eye height amused peasant bread snap state author warm combine sock long quarter balance travel true stove bicycle else remind vendor absorb laugh"
    let newASA = await createASA.createASA(sk, "BOBBY", "BBY", 20000000, 1, "test..");
    console.log("new ASA ",newASA)

    let atomicTransfer = await atomic.atomic(sk,account,newASA.ASA_ID,10)
    console.log("atomic transfer ",atomicTransfer)

    let newNFT = await createNFT.createNFT(sk,"NFTTEST","NFTT","url")
    console.log("new NFT  ",newNFT)


    let atomicTransferNFT = await atomic.atomic(sk,account,newNFT.NFT_ID,1,"NFTurl")
    console.log("atomic transfer nft ",atomicTransferNFT)

}

main()
 