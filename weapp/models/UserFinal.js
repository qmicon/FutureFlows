const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
        email : String,
        privateKey : String
        , publicKey :String,
        address: String
})
mongoose.models = {}

export default mongoose.model("email",EmailSchema )