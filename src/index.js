const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const mysqStore = require('express-mysql-session')
const passport = require('passport')
const {database} = require('./keys')
const flash = require('connect-flash')
const multer = require('multer')
const morgan = require('morgan')


//App setting

const app = express()
require('./lib/passport')

    


//Settings

app.set('port', process.env.PORT || 4500)
app.set('version', ' 1.0.0')
app.set('views', path.join(__dirname, 'views'))



                //views engine
app.engine('.hbs', handlebars.engine({
defaultLayout: 'main',
layoutsDir: path.join(app.get('views'),'layouts'),
partialsDir:path.join(app.get('views'), 'partials'),
extname: '.hbs',
helpers: require('./lib/handlebars')
}))

app.set('views engine', '.hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:'false'}))
app.use(express.json())
app.use(morgan('dev'))




//midlewares
app.use(session({
    secret:'defaultsession',
    resave: false,
    saveUninitialized: false,
    store: new mysqStore(database)
    }))
    


    app.use(flash())
    app.use(passport.initialize())
    app.use(passport.session())

    const storage = multer.diskStorage({
        destination:  'src/public/uploads',
        filename: function(req,file,cb){
    const fileid = uuid.v4()
    app.locals.fileid = fileid+path.extname(file.originalname)
    console.log(fileid+path.extname(file.originalname))
    cb('', fileid + path.extname(file.originalname))
  
        }
    })
    
    const upload = multer({
        storage: storage,
        limits: {fileSize: 10000000},
    
        })
   
        app.use(upload.single('file'))

        console.log(upload.single('file'))



    //global

app.use((req, res, next) => {
    app.locals.admin;
    app.locals.login = req.flash('login');
    app.locals.user = req.user;

    next();
  });

//routes

app.use(require('./routes/home.js'))




app.all('*', (req, res) => {
    res.status(404).redirect('/');
  });


//inicialization

app.listen(app.get('port'), ()=>{

    console.log('Server on port ' + app.get('port') )
    console.log('V. ' + app.get('version') )

})