const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User');
require('dotenv').config({ path: 'variables.env'});


passport.use( new LocalPassport({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
        return done(null, false, { message: 'Usuario no encontrado'});
    }else {
        const isMatch = await user.matchPass(password);
        if(isMatch){
            return done(null, user)
        } else {
            return done(null, false, { message: 'Contraseña incorrecta'});
        }
    }
}));

passport.use(new GoogleStrategy({
    callbackURL: '/users/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ googleId: profile.id});
    if(!user){
        const newUser = new User ({
            name: profile.displayName,
            googleId: profile.id
        });
        newUser.save();
        return done(null, newUser);
    }
    else{
        return done(null, user)
    }
}));

passport.serializeUser( (user, done) => {
    done(null, user.id)
})

passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    });
})