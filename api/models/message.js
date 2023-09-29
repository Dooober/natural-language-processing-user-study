const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user_id: String,
    number: Number,
    input: String,
    verb: Number,
    direction: Number,
    error: String
})

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
