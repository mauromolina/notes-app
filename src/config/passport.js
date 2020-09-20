const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const User = require('../models/User');

passport.use( new LocalPassport({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
        return done(null, false, { message: 'Usuario no encontrado'});
    }else {
        const isMatch = await User.matchPass(password);
        if(isMatch){
            return done(null, user)
        } else {
            return done(null, false, { message: 'Contraseña incorrecta'});
        }
    }
}));