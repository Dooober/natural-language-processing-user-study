const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
    prompt: String,
    input: String,
    response: String
})

const SurveySchema = new Schema({
    time: Number,
    text: String,
    immersion: Number,
    parser: Number,
    scene: Number,
    responseData: [ResponseSchema]
})

const Survey = mongoose.model("Survey", SurveySchema);

module.exports = Survey;