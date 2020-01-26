// Depedencias incorporadas en nodejs
require('dotenv').config();
const fs = require('fs')
const path = require('path');
const https = require('https');

// Dependencias a instalar 
const morgan = require('morgan');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const passport = require('passport');
const login = require('connect-ensure-login');
const cacheControl = require('express-cache-controller');

const app = express();
app.use(cacheControl({
    noCache: true
  }));

// if (process.env.NODE_ENV === 'production') {
//     app.disable('view cache'); // Evita el código HTTP 304 en producción
//     app.disable('etag');
// }
app.use(express.json());
app.set('json spaces', 2);

// Para redirigir trafico no local HTTP a HTTPS
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.PORT)
        res.redirect('https://' + req.headers.host + req.url)
    else
        next();
});

const config = require('./config');
const authRoutes = require('./authRoutes');

app.use('/', express.static(__dirname + '/assets'));
// app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");


app.use(session({
    store: new SQLiteStore,
    secret: 'nueva contraseña',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true } // , maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
}));

app.use(morgan('dev'));
app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session());    // Used to persist login sessions


// Rutas
app.use('/auth', authRoutes);   // Rutas de Autenticación

require('./passport.js');




// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    if (req.user) next();
    else res.render('login');
}

app.get('/', login.ensureLoggedIn('/auth/login'),
    (req, res) => res.render('index', { user: req.user })
);


// Secret route
app.get('/secret', isUserAuthenticated,
    (req, res) => {
        res.render('secreto', { user: req.user })
    }
);

app.get('/perfil', isUserAuthenticated,
    (req, res) => res.render('perfil', { user: req.user })
);

app.get('/logout',
    (req, res) => res.render('logout', { user: req.user })
);


if (!process.env.NODE_ENV) {
    // Para crear un certificado digital en la CLI:
    //  openssl req -nodes -new -x509 -keyout server.key -out server.cert
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app).listen(config.port, () => {
        console.log(`¡Servidor iniciado en ${config.port}!`)
    })
}
else {
    app.listen(config.port, () => console.log(`¡Servidor iniciado en ${config.port}`));
}

