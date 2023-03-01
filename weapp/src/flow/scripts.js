import * as fcl from "@onflow/fcl";

export async function USDCBalance(address) {
    return fcl.query({
      cadence: `
      import FiatToken from 0xFiatToken
      import FungibleToken from 0xFungibleToken
      
      pub fun main(address: Address): UFix64 {
          let cap = getAccount(address).getCapability<&FiatToken.Vault{FungibleToken.Balance}>(FiatToken.VaultBalancePubPath)
          let vau = cap.borrow() ?? panic("Could not borrow market public")
          return vau.balance
      } 
      `,
      args: (arg, t) => [arg(address, t.Address)],
    });
}