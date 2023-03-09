require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.port || 4000;

mongoose.connect(process.env.DB_URI, {useNewUrlParser:true}, );
const db = mongoose.connection

db.on('error', (error) => console.log(error));
db.once('open', () => {
    console.log('connected to the Db')
} )

// middlewraes
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave:false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message
    next()

});

app.set('view engine', 'ejs');



// app.get('/', () => {
    //     res.send("Hello world ")
// })


app.use("", require("./routes/routes"))


app.listen(PORT, () => {
    console.log(`server starting at port ${PORT}`)
})