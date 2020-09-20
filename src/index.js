const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const expSession = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');

const app = express();
require('./db');
require('./config/passport');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(express.urlencoded({
    extended: false
}));

app.use(methodOverride('_method'));

app.use(expSession({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    let user = null
    if(req.user){
        user =JSON.parse(JSON.stringify(req.user))
    } 
    res.locals.user = user 
    next();
});

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})