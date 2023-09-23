require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to DB"))
.catch(console.error);

const Survey = require('./models/survey');

app.post('/survey', (req, res) => {
    const survey = new Survey({
        text: req.body.text
    });

    survey.save();

    res.json(survey);
})

app.listen(3001, () => console.log("Server started on port 3001"));