import FutureFlows from "../contracts/FutureFlows.cdc"

transaction(question: String, imageHash: String, description: String, resolverUrl: String, endAfterSeconds: UFix64) {
    let market: &FutureFlows.Market
    prepare(account: AuthAccount) {
        self.market = account.borrow<&FutureFlows.Market>(from:FutureFlows.MarketStoragePath)
            ?? panic("Could not borrow Market")
    }

    execute {
        self.market.createNewQuestion(question: question, imageHash: imageHash, description: description, resolverUrl: resolverUrl, endAfterSeconds: endAfterSeconds)
    }
}