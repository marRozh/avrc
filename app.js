require('dotenv').config();

/***************************************************\
                    BASIC SETUP
\***************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
//const axios = require('axios');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const fs = require('fs');
const path = require('path');

/***************************************************\
                     ROUTES
\***************************************************/

const indexRoutes = require('./routes/index');


/***************************************************\
                     APP
\***************************************************/

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

app.set('view engine', 'ejs');

/***************************************************\
                    MODELS IMPORT
\***************************************************/
let User = require('./models/user');
let Article = require('./models/article');
let Persona = require('./models/persona');

/***************************************************\
                PASSPORT INSTALL 
\***************************************************/

app.use(require('express-session')({
    secret: 'arussiancoupgold',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

/***************************************************\
                     ROUTES
\***************************************************/

app.use(indexRoutes);


/***************************************************\
                DATABASE INSTALL 
\***************************************************/

const dbUrl = process.env.DB_URL;

const mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`Connected to DB!`))
.catch(error => console.log(error.message));



//******************************************************* 
//****************404 page**************************** 
//******************************************************* 
app.use(function(req, res, next) {
    res.status(404);

    if(req.accepts('html')) {
        res.render('error', {url: req.url});
        return;
    }
});

app.listen(port, () => {
    console.log(`App listning on port https://localhost:${port}`);
});