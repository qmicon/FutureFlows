import FutureFlows from "../contracts/FutureFlows.cdc"
import FiatToken from "../contracts/tokens/FiatToken.cdc"

transaction(answer: Bool, id: UInt64) {
    let ques: &FutureFlows.Question
    prepare(account: AuthAccount) {
        let market = account.borrow<&FutureFlows.Market>(from:FutureFlows.MarketStoragePath)
            ?? panic("Could not borrow Market")
        self.ques = market.borrowQuestionPrivate(id: id)
    }

    execute {
        self.ques.resolveAnswer(answer: answer)
    }
}
