const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    user_id: String,
    background: Number,
    experience: Number,
    error: Number,
    why: String,
    features: String,
    optional: String,
})

const Survey = mongoose.model("Survey", SurveySchema);
module.exports = Survey;