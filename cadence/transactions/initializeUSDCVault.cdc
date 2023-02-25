import FiatToken from "../contracts/tokens/FiatToken.cdc"
import FungibleToken from "../contracts/interfaces/FungibleToken.cdc"

transaction() {
    prepare(account: AuthAccount) {
        if account.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) == nil {
            account.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)
            account.link<&FiatToken.Vault{FungibleToken.Receiver}>(
            FiatToken.VaultReceiverPubPath,
            target: FiatToken.VaultStoragePath
            )
            account.link<&FiatToken.Vault{FungibleToken.Balance}>(
            FiatToken.VaultBalancePubPath,
            target: FiatToken.VaultStoragePath
            )
        }
    }

    execute {
    }
}