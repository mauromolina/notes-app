const router = require('express').Router();

router.get('/notes', (req, res) => {
    res.send('Notas acá');
})

router.get('/users/signup', (req, res) => {
    res.send('Formulario de autenticación');
})

module.exports = router;
