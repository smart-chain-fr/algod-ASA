const ipfsClient = require('ipfs-http-client')
const fs = require('fs/promises');

/**
 * Save the file in Ipfs
 * @param {string} filename - file's name
 * @return {string} hash of ipfs file which has been saved
*/
async function saveIpfs(filename){
    if(typeof filename === 'string'){

        const ipfsAddOptions = {
            cidVersion: 1,
            hashAlg: 'sha2-256'
        }
        let ipfs = ipfsClient("http://51.15.205.207:5001")
        const content = await fs.readFile(filename)
        return (await ipfs.add({ path: filename, content }, ipfsAddOptions)).cid.toString()
    }
}

module.exports = {
    saveIpfs,
}