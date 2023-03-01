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

export async function getTotalQuestions() {
    return fcl.query({
      cadence: `
      import FutureFlows from 0xFutureFlows

      pub fun main(address: Address): UInt64 {
          let cap = getAccount(address).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
          let mar = cap.borrow() ?? panic("Could not borrow market public")
          return mar.totalQuestions
      }
      `,
      args: (arg, t) => [arg(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, t.Address)],
    });
}

export async function getQuestion(id) {
    return fcl.query({
        cadence: `
        import FutureFlows from 0xFutureFlows

        pub fun main(address: Address, key: UInt64): FutureFlows.DataView {
            let cap = getAccount(address).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
            let mar = cap.borrow() ?? panic("Could not borrow market public")
            let ques = mar.borrowQuestion(id: key)
            return ques.getDataView()
        }
        `,
        args: (arg, t) => [arg(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, t.Address), arg(id, t.UInt64)],
      });

}

export async function getMarket() {
    return fcl.query({
        cadence: `
        import FutureFlows from 0xFutureFlows

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
        `,
        args: (arg, t) => [arg(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, t.Address)],
      });

}

export async function getGraph(id) {
    return fcl.query({
        cadence: `
        import FutureFlows from 0xFutureFlows

        pub fun main(address: Address, key: UInt64): FutureFlows.GraphView {
            let cap = getAccount(address).getCapability<&FutureFlows.Market{FutureFlows.MarketPublic}>(FutureFlows.MarketPublicPath)
            let mar = cap.borrow() ?? panic("Could not borrow market public")
            let ques = mar.borrowQuestion(id: key)
            return ques.getGraphView()
        }
        `,
        args: (arg, t) => [arg(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, t.Address), arg(id, t.UInt64)],
      });

}
