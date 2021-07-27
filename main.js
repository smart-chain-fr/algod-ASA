const createAccount = require("./src/createAccount");
const createASA = require("./src/createASA");
const atomic = require('./src/atomic')
const createNFT = require("./src/createNFT")
const saveFile = require('./src/saveFile')

async function main() {
    //let sk = "curious approve soup whale usage correct bunker smoke brisk nut capital rabbit custom all dial funny autumn concert spatial life copy gallery grass absent vacant"
    //let sk = "exchange fat eye height amused peasant bread snap state author warm combine sock long quarter balance travel true stove bicycle else remind vendor absorb laugh"
    let sk = "rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious"

    let account = createAccount.createAccount(); 
    console.log("account ",account)

    //use your mnemonic
    let newASA = await createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
    console.log("new ASA ",newASA)

    let atomicTransfer = await atomic.atomic(sk,account,newASA.ASA_ID,10)
    console.log("atomic transfer ", atomicTransfer)
    
    //your file name
    const filename= "image.jpg"

    const cid = await saveFile.saveIpfs(filename)
    console.log('Content ID : ',cid)
    
    let newNFT = await createNFT.createNFT(sk,"NFTTEST","NFTT",cid)
    console.log("new NFT  ",newNFT)


    let atomicTransferNFT = await atomic.atomic(sk,account,newNFT.NFT_ID,1)
    console.log("atomic transfer nft ",atomicTransferNFT)

}

main()
 