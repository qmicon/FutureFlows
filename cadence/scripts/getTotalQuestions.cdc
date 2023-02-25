import FutureFlows from 0xf83c0be5817ab83d

pub fun main(address: Address): UInt64 {
    let cap = getAccount(address).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
    let mar = cap.borrow() ?? panic("Could not borrow market public")
    return mar.totalQuestions
}