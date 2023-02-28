import * as fcl from '@onflow/fcl'
import { template as createAccountSIX } from '@onflow/six-create-account'
import { userAuthorizationFunction } from './authFunction'

export async function createAccount(publicKeyHex) {
  const txId = await fcl.decode(
    await fcl.send([
      createAccountSIX({
        proposer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        authorization: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        publicKey: publicKeyHex,
        signatureAlgorithm: 1,
        hashAlgorithm: 3,
        weight: '1000.0',
      }),
    ])
  )

  return new Promise((res, rej) => {
    fcl.tx(txId).subscribe((txStatus) => {
      if (txStatus.status === 4) {
        const accountCreatedEvent = txStatus.events.find(
          (event) => event.type === 'flow.AccountCreated'
        )
        if (!accountCreatedEvent) return
        const accountCreatedEventData = accountCreatedEvent.data
        const accountCreatedAddress = accountCreatedEventData.address
        res(accountCreatedAddress)
      } else if (txStatus.status === 5) {
        rej('Error creating account')
      }
    })
  })
}
