import FiatToken from 0xa983fecbed621163
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(address: Address, key: UInt64): UFix64 {
    let cap = getAccount(address).getCapability<&FiatToken.Vault{FungibleToken.Balance}>(FiatToken.VaultBalancePubPath)
    let vau = cap.borrow() ?? panic("Could not borrow market public")
    return vau.balance
}