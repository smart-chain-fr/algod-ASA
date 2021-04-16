const createAccount = require("./createAccount");
const createASA = require("./createASA");
const atomic = require('./atomic')
const createNFT = require("./createNFT")
const saveUrl = require('./saveUrl')
const { sendALGO } = require("./sendALGO");
const saveImg = require('./saveImg')

async function main() {
    let sk = "rescue stock blade work vanish neck expire borrow dolphin insane immense awesome depth tree bamboo uniform direct fold tortoise mass remember next punch ability vicious"

    /*let account = createAccount.createAccount(); 
    console.log("account ",account)

    //use your mnemonic
    let newASA = await createASA.createASA(sk, "BOBBY", "BBY", 20000000, 1, "test..").catch(e =>{console.log(e)});
    console.log("new ASA ",newASA)

    let atomicTransfer = await atomic.atomic(sk,account,newASA.ASA_ID,10)
    console.log("atomic transfer ",atomicTransfer)
    */
    const filename= "../main.go"
    const urlTxHash = await saveImg.saveIpfs('../img.jpg') //(await saveUrl.saveUrl(sk,filename)).txId
    console.log(urlTxHash)
    let newNFT = await createNFT.createNFT(sk,"NFTTEST","NFTT",urlTxHash)//.catch(e=>{console.log(e)})
    console.log("new NFT  ",newNFT)


    //let atomicTransferNFT = await atomic.atomic(sk,account,newNFT.NFT_ID,1,"NFTurl.")
    //console.log("atomic transfer nft ",atomicTransferNFT)

}

main()
 