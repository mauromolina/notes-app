const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

mongoose.connect(process.env.DB_MONGO, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then( db => console.log('DB Conectada!'))
    .catch(err => console.error(err))