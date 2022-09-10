const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');


passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password', 
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {

      done(null, user);
    } else {
    
      done(null, false, req.flash('login', 'Contraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('login', 'El usuario no existe'));
  }
}));



//singup

passport.use('local.signup', new LocalStrategy({

  //obteniendo datos
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {


  //verificando usuario no existe
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    return done(null, false, req.flash('login', 'Nombre de usuario no disponible'))
  }

  else{

    //creando objeto con un nuevo usuario
    const { completeName, country, email, myreferral } = req.body;

    


    let referralcode = codeGenerator()
  

  const createddate = new Date()
    let newUser = {
      completeName,
      country,
      email,
      username,
      referralcode,
      createddate,
      password
    };
    newUser.password = await helpers.encryptPassword(password);

  
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
   
    
    return done(null, newUser);


  }

 
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

