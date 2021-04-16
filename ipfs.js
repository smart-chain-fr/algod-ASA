
async function testizoeriz(){
    const fs = require('fs/promises')
    const ipfsClient = require('ipfs-http-client')
    const ipfsAddOptions = {
        cidVersion: 1,
        hashAlg: 'sha2-256'
      }
    let ipfs = ipfsClient("http://localhost:5001")
    const filename = '../img.jpg'
    const content = await fs.readFile(filename).then(
    
    )
    const { cid: assetCid } = ipfs.add({ path: '../img.jpg', content }, ipfsAddOptions).then(e => console.log(e))
}
testizoeriz()