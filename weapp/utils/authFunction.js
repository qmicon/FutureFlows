import { sign } from "./crypto"

export function userAuthorizationFunction(
    privateKey,
    keyIndex,
    address
  ) {
    return async function (account) {
      return {
        ...account,
        tempId: `${address}-${keyIndex}`,
        addr: address,
        keyId: Number(keyIndex),
        signingFunction: async (signable) => {
          const signature = await sign(signable.message, privateKey)
  
          return {
            addr: address,
            keyId: Number(keyIndex),
            signature,
          }
        },
      }
    }
  }