const User = require('../models/user');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first');
    res.redirect('/login');
};

middlewareObj.isAdmin = function(req, res, next) {
    if(req.user.isAdmin == true) {
        return next();
    }
    req.flash('error', 'You do not have admin rights for this action');
    res.redirect('back');
};




module.exports = middlewareObj