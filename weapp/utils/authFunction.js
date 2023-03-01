import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import * as fcl from "@onflow/fcl";

const ec = new EC('secp256k1');

const sign = (message, privateKey) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
    const sig = key.sign(hash(message)); // hashMsgHex -> hash
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, "be", n);
    const s = sig.s.toArrayLike(Buffer, "be", n);
    return Buffer.concat([r, s]).toString("hex");
}

const hash = (message) => {
    const sha = new SHA3(256);
    sha.update(Buffer.from(message, "hex"));
    return sha.digest();
}
export function userAuthorizationFunction(
  privateKey,
  keyIndex,
  address
) {
  keyIndex = parseInt(keyIndex)
return async (account) => {
    // authorization function need to return an account
    return {
        ...account, // bunch of defaults in here, we want to overload some of them though
        tempId: `${address}-${keyIndex}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
        addr: fcl.sansPrefix(address), // the address of the signatory, currently it needs to be without a prefix right now
        keyId: Number(keyIndex), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
        signingFunction: async signable => {
            // Singing functions are passed a signable and need to return a composite signature
            // signable.message is a hex string of what needs to be signed.
            return {
                addr: fcl.withPrefix(address), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
                keyId: Number(keyIndex), // needs to be the same as account.keyId, once again make sure its a number and not a string
                signature: sign(signable.message, privateKey), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
            }
        }
    }
}
}

// export function userAuthorizationFunction(
//     privateKey,
//     keyIndex,
//     address
//   ) {
//     return async function (account) {
//       return {
//         ...account,
//         tempId: `${address}-${keyIndex}`,
//         addr: address,
//         keyId: Number(keyIndex),
//         signingFunction: async (signable) => {
//           const signature = await sign(signable.message, privateKey)
  
//           return {
//             ...account,
//             addr: address,
//             keyId: Number(keyIndex),
//             signature,
//           }
//         },
//       }
//     }
//   }