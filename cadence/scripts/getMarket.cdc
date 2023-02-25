import FutureFlows from "../contracts/FutureFlows.cdc"

pub fun main(address: Address): [FutureFlows.DataView] {
    let cap = getAccount(address).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
    let mar = cap.borrow() ?? panic("Could not borrow market public")
    var key: UInt64 = 0
    var val: [FutureFlows.DataView] = []
    while(key < mar.totalQuestions) {
        let ques = mar.borrowQuestion(id: key)
        val.append(ques.getDataView())
        key = key + 1
    }
    return val
}