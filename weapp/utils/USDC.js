import { v4 as uuidv4 } from 'uuid'
import openPGP from "./openpgp"

const BASE_URL = "https://api-sandbox.circle.com"

async function createCardPaymentPayload(amount) {

    const amountDetail = {
        amount: amount,
        currency: 'USD',
      }
    const sourceDetails = {
        id: "04447946-cda5-4583-8c77-72737d6eebf2",
        type: "card",
      }
    let payload  ={
        idempotencyKey: uuidv4(),
        autoCapture: true,
        amount: amountDetail,
        source: sourceDetails,
        description: "",
        verificationSuccessUrl: "",
        verificationFailureUrl: "",
        metadata: {
          email: "customer-0007@circle.com",
          phoneNumber: "+12025550180",
          sessionId: 'xxx',
          ipAddress: '172.33.222.1',
        },
        channel: "",
        verification: "cvv"
      }
  
    const cardDetails = { cvv: "123" }
  
    const publicKeyRes = await getPCIPublicKey()
    console.log()
    const publicKey = publicKeyRes.data
    const encryptedData = await openPGP.encrypt(cardDetails, publicKey)
    payload.encryptedData = encryptedData.encryptedMessage
    payload.keyId = encryptedData.keyId
    return payload
}

async function getPCIPublicKey() {
    const url = BASE_URL + "/v1/encryption/public"
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_TOKEN}`
      }
    })
    return await res.json()
}

export async function getCardPaymentStatus(id) {
    const url = BASE_URL + "/v1/payments/" + id
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_TOKEN}`
      }
    })
    return await res.json()
}

export async function buyUSDCwithCard(amount) {
    const url = BASE_URL + "/v1/payments"
    let body = await createCardPaymentPayload(amount)
    let res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_TOKEN}`
        },
        body: JSON.stringify(body)
      })
      return await res.json()
}

async function getMasterWalletID() {
    const url = BASE_URL + "/v1/configuration"
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_TOKEN}`
      }
    })
    return await res.json()
}

export async function tranferCryptoToWallet(address, amount) {
    const config = await getMasterWalletID()
    const id = config.data.payments.masterWalletId
    const payload = {
        idempotencyKey: uuidv4(),
        source: {
            type: "wallet",
            id: id
        },
        amount: {
            amount: amount,
            currency: "USD"
        },
        destination: {
            type: "blockchain",
            address: address,
            chain: "FLOW"
        }
    }

    const url = BASE_URL + "/v1/transfers"
    let res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_TOKEN}`
        },
        body: JSON.stringify(payload)
      })
      return await res.json()
}

export async function getCryptoTransferStatus(id) {
    const url = BASE_URL + "/v1/transfers/" + id
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_TOKEN}`
      }
    })
    return await res.json()
}
