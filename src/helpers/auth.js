const helpers = {};

helpers.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Inicia sesión para realizar esta acción');
    res.redirect('/users/signin');
} 

module.exports = helpers