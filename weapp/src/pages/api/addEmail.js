import EmailSchema from "../../models/UsersFinal";
import connectDB from "../../middleware/mongoose";
import { generateKeys } from "../../utils/crypto";

const handler = async (req, res) => {
    if (req.method == 'POST')
    {   console.log(req.body)
        let body = JSON.parse(req.body)
        let details = await EmailSchema.findOne({email: body.email})
        if(details) {
            console.log(details, "exisyt")
            res.status(422).json({error:"email registered"})
        }
        else {
            let keys = await generateKeys()
            let emailAddress = new EmailSchema({...body, ...keys})
            await emailAddress.save()
            console.log(body.email, "doesnt")
            res.status(200).json({success: "success"})
        }
    }
    else {
        res.status(400).json({error : "not allowed"})
    }
}

export default connectDB(handler);