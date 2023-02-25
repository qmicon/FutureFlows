import FutureFlows from "../contracts/FutureFlows.cdc"
import FiatToken from "../contracts/tokens/FiatToken.cdc"

transaction() {
    prepare(account: AuthAccount) {
    }
    execute {
        FutureFlows.distributeFunds()
    }
}
