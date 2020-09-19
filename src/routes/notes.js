const router = require('express').Router();
const Note = require('../models/Note');

router.get('/notes/new', (req, res) => {
    res.render('notes/newNote');
})

router.post('/notes/add', async (req, res) => {
    const { title, description } = req.body;
    const msg = [];
    if(!title) {
        msg.push({text: 'El título es obligatorio!'});
    }
    if(!description){
        msg.push({text: 'La descripción es obligatoria!'})
    }
    if(msg.length > 0){
        res.render('notes/newNote', {
            msg,
            title,
            description
        })
    } else {
        const note = new Note({
            title,
            description
        });
        await note.save();
        msg.push({
            text: 'Se agregó correctamente la nueva nota!'
        })
        res.redirect('/notes');
    }
})

router.get('/notes', async (req, res) => {
    const notes = await Note.find().sort({ creationDate: 'desc'})
    .then(data => {
        const allNotes = {
            notes: data.map(doc => {
            return {
                title: doc.title,
                description: doc.description
            }
        })
    }
    res.render('notes/notesList', {
        notes: allNotes.notes
    });
    })
})

module.exports = router;
