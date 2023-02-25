import FutureFlows from "../contracts/FutureFlows.cdc"
import FiatToken from "../contracts/tokens/FiatToken.cdc"

transaction(contract: Address, amount: UFix64, id: UInt64) {
    let ques: &{FutureFlows.QuestionPublic}
    let vault: @FiatToken.Vault
    let betFor: Address
    prepare(account: AuthAccount) {
        let cap = getAccount(contract).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
        let market = cap.borrow() ?? panic("Could not borrow market public")
        self.ques = market.borrowQuestion(id: id)
        let myVault = account.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) ?? panic("Could not borrow FiatToken Vault from Storage")
        self.vault <- myVault.withdraw(amount: amount) as! @FiatToken.Vault
        self.betFor = account.address
    }

    execute {
        self.ques.addNoBet(noVault: <- self.vault, betFor: self.betFor)
    }
}