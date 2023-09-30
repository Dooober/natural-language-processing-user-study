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

const User = require('./models/user');
const Message = require('./models/message');
const Survey = require('./models/survey');

app.get('/user', (req, res) => {
    const user = new User({
        user_id: crypto.randomUUID(),
        parser: Math.floor(Math.random() * 2) + 1
    });

    user.save();

    res.json(user);
})

app.post('/message', (req, res) => {
    const message = new Message({
        user_id: req.body.user_id,
        number: req.body.number,
        input: req.body.input,
        verb: req.body.verb,
        direction: req.body.direction,
        error: req.body.error
    })

    message.save();

    res.json(message);
})

app.post('/survey', (req, res) => {
    const survey = new Survey({
        user_id: req.body.user_id,
        background: req.body.background,
        experience: req.body.experience,
        error: req.body.error,
        why: req.body.why,
        features: req.body.features,
        optional: req.body.optional,
    });

    survey.save();

    res.json(survey);
})

app.listen(443, () => console.log("Server started on port 443"));