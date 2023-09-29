const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: String,
    parser: Number
})

const User = mongoose.model("User", UserSchema);
module.exports = User;