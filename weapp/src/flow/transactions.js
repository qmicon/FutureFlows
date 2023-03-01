import * as fcl from "@onflow/fcl";
import { userAuthorizationFunction } from "utils/authFunction";

export async function initUSDCVault(authAccount) {
    return fcl.mutate({
        cadence: `
        import FiatToken from 0xFiatToken
        import FungibleToken from 0xFungibleToken

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
        `,
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        proposer: authAccount,
        authorizations: [authAccount],
        limit: 1000,
      });
}
    
export async function createNewQuestion(question, imageHash, description, resolverUrl, endAfterSeconds) {
    return fcl.mutate({
        cadence: `
        import FutureFlows from 0xFutureFlows

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
        `,
        args: (arg, t) => [arg(question, t.String), arg(imageHash, t.String), arg(description, t.String), arg(resolverUrl, t.String), arg(endAfterSeconds, t.UFix64)],
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        proposer: userAuthorizationFunction(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY, process.env.NEXT_PUBLIC_ADMIN_KEY_INDEX, process.env.NEXT_PUBLIC_ADMIN_ADDRESS),
        authorizations: [userAuthorizationFunction(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY, process.env.NEXT_PUBLIC_ADMIN_KEY_INDEX, process.env.NEXT_PUBLIC_ADMIN_ADDRESS)],
        limit: 1000,
      });
}

export async function addYesBet(authAccount, amount, id) {
    return fcl.mutate({
        cadence: `
        import FutureFlows from 0xFutureFlows
        import FiatToken from 0xFiatToken

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
                self.ques.addYesBet(yesVault: <- self.vault, betFor: self.betFor)
            }
        }        
        `,
        args: (arg, t) => [arg(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, t.Address), arg(amount, t.UFix64), arg(id, t.UInt64)],
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        proposer: authAccount,
        authorizations: [authAccount],
        limit: 1000,
      });
}

export async function addNoBet(authAccount, amount, id) {
    return fcl.mutate({
        cadence: `
        import FutureFlows from 0xFutureFlows
        import FiatToken from 0xFiatToken
        
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
        `,
        args: (arg, t) => [arg(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, t.Address), arg(amount, t.UFix64), arg(id, t.UInt64)],
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        proposer: authAccount,
        authorizations: [authAccount],
        limit: 1000,
      });
}

export async function resolveQuestion(answer, id) {
    return fcl.mutate({
        cadence: `
        import FutureFlows from 0xFutureFlows
        import FiatToken from 0xFiatToken
        
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
        `,
        args: (arg, t) => [arg(answer, t.Bool), arg(id, t.UInt64)],
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        proposer: userAuthorizationFunction(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY, process.env.NEXT_PUBLIC_ADMIN_KEY_INDEX, process.env.NEXT_PUBLIC_ADMIN_ADDRESS),
        authorizations: [userAuthorizationFunction(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY, process.env.NEXT_PUBLIC_ADMIN_KEY_INDEX, process.env.NEXT_PUBLIC_ADMIN_ADDRESS)],
        limit: 1000,
      });
}

export async function distributePrize(authAccount) {
    return fcl.mutate({
        cadence: `
        import FutureFlows from 0xFutureFlows
        import FiatToken from 0xFiatToken
        
        transaction() {
            prepare(account: AuthAccount) {
            }
            execute {
                FutureFlows.distributeFunds()
            }
        }
        `,
        payer: userAuthorizationFunction(process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY, process.env.NEXT_PUBLIC_RELAYER_KEY_INDEX, process.env.NEXT_PUBLIC_RELAYER_ADDRESS),
        proposer: authAccount,
        authorizations: [authAccount],
        limit: 1000,
      });
}
