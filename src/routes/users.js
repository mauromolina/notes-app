const router = require('express').Router();
const User = require('../models/User');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
})

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
})

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm } = req.body;
    const errors = [];
    let alerts = {}
    if(name.length < 1 || email.length < 1 || password.length < 1){
        errors.push({
            text: 'Error! Todos los campos son obligatorios.'
        })
        if(name.length < 1){
            alerts = {
                ...alerts,
                msgName: 'is-invalid'
            }
        } 
        if(email.length < 1) {
            alerts = {
                ...alerts,
                msgEmail: 'is-invalid'
            }
        }
        if(password.length < 1) {
            alerts = {
                ...alerts,
                msgPass: 'is-invalid'
            }
        }
    }
    
    if(password != confirm){
        errors.push({
            text: 'Las contraseñas no coinciden!'
        })
        alerts = {
            ...alerts,
            msgConfirm: 'is-invalid',
            msgPass: 'is-invalid'
        }
    }
    if(password.length < 5){
        errors.push({
            text: 'La contraseña debe ser al menos de 5 caracteres!',
        })
        alerts = {
            ...alerts,
            msgConfirm: 'is-invalid'
        }
    }
    if(errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirm, alerts});
    }else {
        const emailUser = await User.findOne({ email: email});
        if( emailUser ){
            req.flash('error_msg', 'El email ya está registrado.');
            res.redirect('/users/signup');
        }else {
            const user = new User({name, email, password});
            user.password = await user.encryptPass(password);
            await user.save();
            req.flash('success_msg', 'Registro exitoso!');
            res.redirect('/users/signin');
        }
    }
})

module.exports = router;
