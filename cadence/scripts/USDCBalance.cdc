import FiatToken from "../contracts/tokens/FiatToken.cdc"
import FungibleToken from "../contracts/interfaces/FungibleToken.cdc" 

pub fun main(address: Address): UFix64 {
    let cap = getAccount(address).getCapability<&FiatToken.Vault{FungibleToken.Balance}>(FiatToken.VaultBalancePubPath)
    let vau = cap.borrow() ?? panic("Could not borrow market public")
    return vau.balance
}