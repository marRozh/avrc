const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Article = require('../models/article');
const Persona = require('../models/persona');

const async = require('async');

const middleware = require('../middleware/index');
const middlewareObj = require('../middleware/index');

const crypto = require('crypto');
const persona = require('../models/persona');


router.get('/about', (req, res) => {
    Article.find({}, function(err, allArticles) {
        if(err) {
            console.log(err);
        } else {
            let titlepage;
            let bullets = [];
            let breakin;
            let articles = [];
            allArticles.forEach(function(article) {
                if(article.alias == 'titlepage') {
                    titlepage = article;
                } else if (article.alias == 'bullet') {
                    bullets.push(article);
                } else if (article.alias == 'breakin') {
                    breakin = article;
                } else if (article.alias == 'article') {
                    articles.push(article);
                };
            });
            Persona.find().sort('order').exec(function(err, allPersonas) {
                if(err) {
                    console.log();
                } else {
                    res.render('index', {articles: articles, titlepage: titlepage, bullets: bullets, breakin: breakin, personas: allPersonas});
                };
            });
        }
    });
});

router.get('/role-of-women-in-boardroom', (req, res) => {
    res.render('gorilla');
});

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/press', (req, res) => {
    res.render('press');
});

router.get('/article/:id', (req, res) => {
    let articleId = req.params.id;

    Article.findById(articleId, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            Persona.find().sort('order').exec(function(err, personas) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('article', {article: article, personas: personas});
                }
            });
        }
    });
});

router.get('/profile/:name', (req, res) => {
    let person = req.params.name;
    Persona.findOne({namelink: person}, function(err, persona) {
        if(err) {
            console.log(err);
        } else {
            Persona.find().sort('order').exec(function(err, personas) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('profile', {persona: persona, personas: personas});
                }
            });
        }
    });
});

router.get('/article/:id', (req, res) => {
    let articleId = req.params.id;
    Article.findById(articleId, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            res.render('article', {article: article});
        }
    });
});

router.get('/breakin', (req, res) => {
    Article.findOne({alias: 'breakin'}, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            Persona.find().sort('order').exec(function(err, personas) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('article', {article: article, personas: personas});
                }
            })
        };
    });
});

router.delete('/deletearticle/:id', (req, res) => {
    let articleId = req.params.id;
    Article.findByIdAndDelete(articleId, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/about');
        }
    });
});
//******************************************************* 
//****************AUTH ROUTES**************************** 
//******************************************************* 

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    passport.authenticate('local',
    {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/about');
});

router.post('/register', (req, res) => {

    let newUserUsername = req.body.username;
    let newUserPassword = req.body.password;

    User.find({username: newUserUsername}, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            let newUser = new User({
                username: newUserUsername
            });
            User.register(newUser, newUserPassword, function(err, user) {
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('/register');
                }
                passport.authenticate('local')(req, res, function() {
            
                console.log(`Created user: ${user}`);
                res.redirect('/admin');
        
                });
            });
        }
    });
    
});

router.get('/admin',  middleware.isLoggedIn, (req, res) => {
    Persona.find({}, function(err, personas) {
        if(err) {
            console.log(err);
        } else {
            Article.find({}, function(err, articles) {
                if(err) {
                    console.log(err);
                } else {
                    res.render('admin', {personas: personas, articles: articles});
                }
            });
        }
    });
});


router.post('/addpersona',  middleware.isLoggedIn, (req, res) => {
    let newPersona = req.body.persona;

    Persona.create(newPersona, function(err, persona) {
        if(err) {
            console.log(err);
        } else {
            let name = newPersona.name;
            let linkName = name.replace(' ', '-').toLowerCase();
            persona.namelink = linkName;

            let aboutToString = newPersona.about.toString();
            persona.aboutPlain = aboutToString.replace( /(<([^>]+)>)/ig, '');

            let additionalToString = newPersona.additional.toString();
            persona.additionalPlain = additionalToString.replace( /(<([^>]+)>)/ig, '');

            persona.save();

            console.log(`persona created: ${persona}`);
            res.redirect('back');
        };
    });
});

router.post('/deletepersona', middleware.isLoggedIn, (req, res) => {
    let idsToDelete = req.body.persona;
    console.log(`IDS TO DELETE: ${idsToDelete}`);
    Persona.findByIdAndRemove({$in: idsToDelete}, function(err, persona) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('back');
        }
    });
});

router.post('/addarticle', middleware.isLoggedIn,  (req, res) => {
    let newArticle = req.body.article;

    Article.create(newArticle, function(err, article) {
        if(err) {
            console.log(err);
        } else {

            let titleToString = newArticle.title.toString();
            article.titlePlain = titleToString.replace( /(<([^>]+)>)/ig, '');

            let textToString = newArticle.text.toString();
            article.textPlain = textToString.replace( /(<([^>]+)>)/ig, '');

            let shortToString = newArticle.short.toString();
            article.shortPlain = shortToString.replace( /(<([^>]+)>)/ig, '');

            let authorToString = newArticle.writtenBy.toString();
            article.writtenByPlain = authorToString.replace( /(<([^>]+)>)/ig, '');

            article.save();
            console.log(`article created: ${article}`);
            res.redirect('back');
        };
    });
});

router.post('/deletearticle', middleware.isLoggedIn, (req, res) => {
    let idsToDelete = req.body.article;
    console.log(`IDS TO DELETE: ${idsToDelete}`);
    Article.findByIdAndRemove({$in: idsToDelete}, function(err, article) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('back');
        };
    });
});

router.put('/editarticle/:id', middleware.isLoggedIn, (req, res) => {
    let articleId = req.params.id;
    let updatedArticle = req.body.article;

    Article.findByIdAndUpdate(articleId, updatedArticle, function(err, article) {
        if(err) {
            console.log(err);
        } else {

            let titleToString = updatedArticle.title.toString();
            article.titlePlain = titleToString.replace( /(<([^>]+)>)/ig, '');

            let textToString = updatedArticle.text.toString();
            article.textPlain = textToString.replace( /(<([^>]+)>)/ig, '');

            let shortToString = updatedArticle.short.toString();
            article.shortPlain = shortToString.replace( /(<([^>]+)>)/ig, '');

            let authorToString = updatedArticle.writtenBy.toString();
            article.writtenByPlain = authorToString.replace( /(<([^>]+)>)/ig, '');

            article.save();

            console.log(article);

            res.redirect('back');
        }
    });
});

router.put('/editpersona/:id', middleware.isLoggedIn, (req, res) => {
    let personaId = req.params.id;
    let updatedPersona = req.body.persona;

    Persona.findByIdAndUpdate(personaId, updatedPersona, function(err, persona) {
        if(err) {
            console.log(err);
        } else {

            let name = updatedPersona.name;
            let linkName = name.replace(' ', '-').toLowerCase();
            persona.namelink = linkName;

            let aboutToString = updatedPersona.about.toString();
            persona.aboutPlain = aboutToString.replace( /(<([^>]+)>)/ig, '');

            let additionalToString = updatedPersona.additional.toString();
            persona.additionalPlain = additionalToString.replace( /(<([^>]+)>)/ig, '');

            persona.save();

            console.log(`persona updated: ${persona}`);
            res.redirect('back');
        }
    });
});



module.exports = router;