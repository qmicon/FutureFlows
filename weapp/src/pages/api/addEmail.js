import EmailSchema from "../../../models/UserFinal"
import connectDB from "../../../middleware/mongoose";
import { generateKeys } from "../../../utils/crypto";
import { createAccount } from "../../../utils/account";
import { config } from "@onflow/fcl";

config({
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  });

const handler = async (req, res) => {
    if (req.method == 'POST')
    {   console.log(req.body)
        let body = JSON.parse(req.body)
        let details = await EmailSchema.findOne({email: body.email})
        if(details) {
            res.status(422).json({error:"email registered"})
        }
        else {
            let keys = await generateKeys()
            let address = await createAccount(keys.publicKey)
            let emailAddress = new EmailSchema({...body, ...keys, address: address})
            await emailAddress.save()
            res.status(200).json({success: "success"})
        }
    }
    else {
        res.status(400).json({error : "not allowed"})
    }
}

export default connectDB(handler);