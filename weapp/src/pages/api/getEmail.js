import EmailSchema from "../../models/UsersFinal";
import connectDB from "../../middleware/mongoose";

const handler = async (req, res) => {
  let emails = await EmailSchema.find({email: req.query.email})
  res.status(200).json(emails);
}

export default connectDB(handler);
