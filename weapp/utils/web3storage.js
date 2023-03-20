import { Web3Storage} from 'web3.storage'
// import axios from 'axios'

// export const read_from_ipfs = async (ipfs_cid, filename) => {
//     const storage = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_TOKEN });
//     try {var res = await storage.get(ipfs_cid);
//     if(res.ok) {
//         var files = await res.files();
//         return [true,files];
//     }
//     }   
//     catch(err) {
//         if(filename.endsWith(".png")) {
//         return [false, `https://${ipfs_cid}.ipfs.w3s.link/${filename}`];
//         }
//         var response = await axios.get(`https://${ipfs_cid}.ipfs.w3s.link/${filename}`);
//         return [false, response.data];
//     }
//     return null;

// }

export const write_to_ipfs = async (files) => {
    const storage = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_TOKEN });
    var ipfs_cid = await storage.put(files);
    return ipfs_cid;
}
