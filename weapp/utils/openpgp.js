import { createMessage, encrypt as pgpEncrypt, readKey } from 'openpgp'

/**
 * Encrypt dataToEncrypt
 *
 * @param {Object} dataToEncrypt
 * @param {PublicKey} Object containing keyId and publicKey properties
 *
 * @return {Object} Object containing encryptedMessage and keyId
 */
async function encrypt(dataToEncrypt, { keyId, publicKey }) {
  if (!publicKey || !keyId) {
    throw new Error('Unable to encrypt data')
  }

  const decodedPublicKey = await readKey({ armoredKey: atob(publicKey) })
  const message = await createMessage({ text: JSON.stringify(dataToEncrypt) })
  return pgpEncrypt({
    message,
    encryptionKeys: decodedPublicKey,
  }).then((ciphertext) => {
    return {
      encryptedMessage: btoa(ciphertext),
      keyId,
    }
  })
}

export default {
  encrypt,
}
