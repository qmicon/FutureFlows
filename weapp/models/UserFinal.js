const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
        email : String,
        privateKey : String
        , publicKey :String
})
mongoose.models = {}

export default mongoose.model("email",EmailSchema )