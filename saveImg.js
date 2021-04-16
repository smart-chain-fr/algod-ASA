const ipfsClient = require('ipfs-http-client')
const fs = require('fs/promises');


async function saveIpfs(filename){
    const ipfsAddOptions = {
        cidVersion: 1,
        hashAlg: 'sha2-256'
      }
    let ipfs = ipfsClient("http://51.15.205.207:5001")
    const content = await fs.readFile(filename)
    return (await ipfs.add({ path: filename, content }, ipfsAddOptions)).cid.toString()
}
module.exports = {
    saveIpfs,
}