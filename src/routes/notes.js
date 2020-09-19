const router = require('express').Router();

router.get('/notes', (req, res) => {
    res.send('Notas acá');
})

module.exports = router;
