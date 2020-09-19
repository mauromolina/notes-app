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
        req.flash('success_msg', 'Nota agregada correctamente!')
        res.redirect('/notes');
    }
})

router.get('/notes', async (req, res) => {
    const notes = await Note.find().sort({ creationDate: 'desc'})
    .then(data => {
        const allNotes = {
            notes: data.map(doc => {
            return {
                _id: doc._id,
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

router.get('/notes/edit/:id', async (req, res) => {
    const actNote = await Note.findById(req.params.id)
    .then( data => {
        const note = {
            _id: data._id,
            title: data.title,
            description: data.description
        }
        res.render('notes/editNote', { note })
    })
});

router.put('/notes/editNote/:id', async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description});
    req.flash('success_msg', 'Nota editada correctamente!')
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada correctamente!')
    res.redirect('/notes');
})

module.exports = router;
