const router = require('express').Router();
const Note = require('../models/Note');
const { isAuth } = require('../helpers/auth')

router.get('/notes/new', isAuth, (req, res) => {
    res.render('notes/newNote');
})

router.post('/notes/add', isAuth, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: 'El título es obligatorio!'});
    }
    if(!description){
        errors.push({text: 'La descripción es obligatoria!'})
    }
    if(errors.length > 0){
        res.render('notes/newNote', {
            errors,
            title,
            description
        })
    } else {
        const note = new Note({
            title,
            description
        });
        note.user = req.user.id;
        await note.save();
        req.flash('success_msg', 'Nota agregada correctamente!')
        res.redirect('/notes');
    }
})

router.get('/notes', isAuth, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({ creationDate: 'desc'})
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

router.get('/notes/edit/:id', isAuth, async (req, res) => {
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

router.put('/notes/editNote/:id', isAuth, async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description});
    req.flash('success_msg', 'Nota editada correctamente!')
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuth, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada correctamente!')
    res.redirect('/notes');
})

module.exports = router;
