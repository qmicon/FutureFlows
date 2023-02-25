import FiatToken from "./tokens/FiatToken.cdc"
import FungibleToken from "./interfaces/FungibleToken.cdc"
// Deployed at: 0x5cc5b9db6b7da090
pub contract FutureFlows {

     pub struct AmountAdded {
        pub var user: Address
        pub var amount: UFix64
        pub var timestamp: UFix64

        init(
            user: Address,
            amount: UFix64,
            timestamp: UFix64
        ) {
            self.user = user
            self.amount = amount
            self.timestamp = timestamp
        }
    }

    pub struct GraphView {
        pub var yesCount: [AmountAdded]
        pub var noCount: [AmountAdded]

        init(
            yesCount: [AmountAdded],
            noCount: [AmountAdded]
        ) {
            self.yesCount = yesCount
            self.noCount = noCount
        }
    }

    pub struct DataView {
        pub var id: UInt64
        pub var question: String
        pub var imageHash: String
        pub var totalAmount: UFix64
        pub var totalYesCount: UFix64
        pub var totalNoCount: UFix64
        pub var description: String
        pub var endTimestamp: UFix64
        pub var resolverUrl: String

        init(
            id: UInt64,
            question: String,
            imageHash: String,
            totalAmount: UFix64,
            totalYesCount: UFix64,
            totalNoCount: UFix64,
            description: String,
            endTimestamp: UFix64,
            resolverUrl: String
        ) {
            self.id = id
            self.question = question
            self.imageHash = imageHash
            self.totalAmount = totalAmount
            self.totalYesCount = totalYesCount
            self.totalNoCount = totalNoCount
            self.description = description
            self.endTimestamp = endTimestamp
            self.resolverUrl = resolverUrl
        }
    }

    pub resource interface QuestionPublic {
        pub let id: UInt64
        pub let question: String
        pub let imageHash: String
        pub var totalAmount: UFix64
        pub var totalYesCount: UFix64
        pub var totalNoCount: UFix64
        pub let description: String
        pub let endTimestamp: UFix64
        pub let resolverUrl: String
        pub var yesCount: [AmountAdded]
        pub var noCount: [AmountAdded]
        pub var questionResolved: Bool
        pub var resolveValue: Bool?

        pub fun getDataView(): DataView
        pub fun getGraphView(): GraphView
        pub fun addYesBet(yesVault: @FiatToken.Vault, betFor: Address)
        pub fun addNoBet(noVault: @FiatToken.Vault, betFor: Address)
    }

    pub resource interface QuestionPrivate {
        pub fun resolveAnswer(answer: Bool)
    }

    pub resource Question: QuestionPublic, QuestionPrivate {
        pub let id: UInt64
        pub let question: String
        pub let imageHash: String
        pub var totalAmount: UFix64
        pub var totalYesCount: UFix64
        pub var totalNoCount: UFix64
        pub let description: String
        pub let endTimestamp: UFix64
        pub let resolverUrl: String
        pub var yesCount: [AmountAdded]
        pub var noCount: [AmountAdded]

        pub var questionResolved: Bool
        pub var resolveValue: Bool?

        init(
            id: UInt64,
            question: String,
            imageHash: String,
            description: String,
            resolverUrl: String,
            endTimestamp: UFix64
        ) {
            self.id = id
            self.question = question
            self.imageHash = imageHash
            self.description = description
            self.resolverUrl = resolverUrl
            self.endTimestamp = endTimestamp
            self.totalAmount = 0.0
            self.totalYesCount = 0.0
            self.totalNoCount = 0.0
            self.yesCount = []
            self.noCount = []
            self.questionResolved = false
            self.resolveValue = nil
        }


        pub fun getDataView(): DataView {
            return DataView(
                id: self.id,
                question: self.question,
                imageHash: self.imageHash,
                totalAmount: self.totalAmount,
                totalYesCount: self.totalYesCount,
                totalNoCount: self.totalNoCount,
                description: self.description,
                endTimestamp: self.endTimestamp,
                resolverUrl: self.resolverUrl
            )
        }

        pub fun getGraphView(): GraphView {
            return GraphView(
                yesCount: self.yesCount,
                noCount: self.noCount
            )
        }

        pub fun addYesBet(yesVault: @FiatToken.Vault, betFor: Address) {
            pre {
                self.questionResolved == false: "Betting is over"
                self.endTimestamp > getCurrentBlock().timestamp: "Betting period finished"
            }
            let investment = yesVault.balance
            FutureFlows.betVault.deposit(from: <- yesVault)

            self.totalAmount = self.totalAmount + investment
            self.totalYesCount = self.totalYesCount + investment
            self.yesCount.append(
                AmountAdded(
                    user: betFor,
                    amount: investment,
                    timestamp: getCurrentBlock().timestamp
                )
            )
        }

        pub fun addNoBet(noVault: @FiatToken.Vault, betFor: Address) {
            pre {
                self.questionResolved == false: "Betting is over"
                self.endTimestamp > getCurrentBlock().timestamp: "Betting period finished"
            }
            let investment = noVault.balance
            FutureFlows.betVault.deposit(from: <- noVault)

            self.totalAmount = self.totalAmount + investment
            self.totalNoCount = self.totalNoCount + investment
            self.noCount.append(
                AmountAdded(
                    user: betFor,
                    amount: investment,
                    timestamp: getCurrentBlock().timestamp
                )
            )
        }

        pub fun resolveAnswer(answer: Bool) {
            pre {
                self.questionResolved == false : "Already Resolved"
            }
            self.questionResolved = true
            self.resolveValue = answer
        }
    }

    pub resource interface MarketPublic {
        pub var totalQuestions: UInt64
        pub fun borrowQuestion(id: UInt64): &{FutureFlows.QuestionPublic}
    }

    pub resource interface MarketPrivate {
        pub fun createNewQuestion(
            question: String,
            imageHash: String,
            description: String,
            resolverUrl: String,
            endTimestamp: UFix64
        )
        pub fun borrowQuestionPrivate(id: UInt64): &FutureFlows.Question
    }

    pub resource Market: MarketPublic, MarketPrivate {
        pub var totalQuestions: UInt64
        pub var postedQuestions: @{UInt64 : FutureFlows.Question}
        init() {
            self.totalQuestions = 0
            self.postedQuestions <- {} 
        }

        destroy () {
            destroy self.postedQuestions
        }

        pub fun borrowQuestionPrivate(id: UInt64): &FutureFlows.Question {
            pre {
                self.postedQuestions[id] != nil: "Question does not exist"
            }
            let ref = (&self.postedQuestions[id] as auth &FutureFlows.Question?)!
            return ref as! &FutureFlows.Question
        }

        pub fun borrowQuestion(id: UInt64): &{FutureFlows.QuestionPublic} {
            pre {
                self.postedQuestions[id] != nil : "Question does not exist"
            }
            
            let ref = (&self.postedQuestions[id] as auth &FutureFlows.Question?)!
            return ref as! &FutureFlows.Question
        }

        pub fun createNewQuestion(
            question: String,
            imageHash: String,
            description: String,
            resolverUrl: String,
            endTimestamp: UFix64
        ) {
            let ques <- create FutureFlows.Question(
                id: self.totalQuestions,
                question: question,
                imageHash: imageHash,
                description: description,
                resolverUrl: resolverUrl,
                endTimestamp: endTimestamp
            )
            let oldQuestion <- self.postedQuestions[self.totalQuestions] <- ques
            self.totalQuestions = self.totalQuestions + 1
            destroy oldQuestion
        }

    }

    priv var betVault: @FiatToken.Vault

    pub let MarketStoragePath: StoragePath
    pub let MarketPrivatePath: PrivatePath
    pub let MarketPublicPath: PublicPath

    pub event ContractInitialized()

    init() {
        self.betVault <- FiatToken.createEmptyVault()

        self.MarketStoragePath = StoragePath(identifier: "FutureFlowsInfo") ?? panic("Could not set storage path")
        self.MarketPrivatePath = PrivatePath(identifier: "FutureFlowsInfo") ?? panic("Could not set private path")
        self.MarketPublicPath = PublicPath(identifier: "FutureFlowsInfo") ?? panic("Could not set public path")

        self.account.save(<- create Market(), to: FutureFlows.MarketStoragePath)
        self.account.link<&FutureFlows.Market{FutureFlows.MarketPublic}>(self.MarketPublicPath, target: self.MarketStoragePath)
        self.account.link<&FutureFlows.Market>(self.MarketPrivatePath, target: self.MarketStoragePath)

        if self.account.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) == nil {
            self.account.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)
            self.account.link<&FiatToken.Vault{FungibleToken.Receiver}>(
            FiatToken.VaultReceiverPubPath,
            target: FiatToken.VaultStoragePath
            )
            self.account.link<&FiatToken.Vault{FungibleToken.Balance}>(
            FiatToken.VaultBalancePubPath,
            target: FiatToken.VaultStoragePath
            )
        }

        emit ContractInitialized()
    }

    pub fun distributeFunds() {
        let market = self.account.borrow<&FutureFlows.Market>(from: FutureFlows.MarketStoragePath) ?? panic("Market Resource not Accessible")
        for key in market.postedQuestions.keys {
            if market.postedQuestions[key]?.questionResolved == true {
                if market.postedQuestions[key]?.resolveValue == true {
                    for yesCount in market.postedQuestions[key]?.yesCount as! [AmountAdded] {
                        var amount = market.postedQuestions[key]?.totalNoCount as! UFix64 * yesCount.amount / market.postedQuestions[key]?.totalNoCount as! UFix64
                        amount = amount + yesCount.amount
                        let account = getAccount(yesCount.user)
                        let cap = account.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultBalancePubPath)
                        let rec = cap.borrow() ?? panic("Cannot borrow Fiat Receiver")
                        rec.deposit(from: <- self.betVault.withdraw(amount: amount))
                    }
                }

                else {
                    for noCount in market.postedQuestions[key]?.noCount as! [AmountAdded] {
                        var amount = market.postedQuestions[key]?.totalYesCount as! UFix64 * noCount.amount / market.postedQuestions[key]?.totalYesCount as! UFix64
                        amount = amount + noCount.amount
                        let account = getAccount(noCount.user)
                        let cap = account.getCapability<&FiatToken.Vault{FungibleToken.Receiver}>(FiatToken.VaultBalancePubPath)
                        let rec = cap.borrow() ?? panic("Cannot borrow Fiat Receiver")
                        rec.deposit(from: <- self.betVault.withdraw(amount: amount))
                    }
                }
            }
        }
    }
}
