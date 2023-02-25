import FutureFlows from "../contracts/FutureFlows.cdc"

pub fun main(address: Address, key: UInt64): FutureFlows.DataView {
    let cap = getAccount(address).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
    let mar = cap.borrow() ?? panic("Could not borrow market public")
    let ques = mar.borrowQuestion(id: key)
    return ques.getDataView()
}