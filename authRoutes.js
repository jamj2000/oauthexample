const path = require('path');
const express = require('express');
const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const config = require('./config.js');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login.ejs');
});


// router.get('/google',
//     passport.authenticate('google'));

router.get('/google', passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
}));

router.get('/facebook', passport.authenticate('facebook'));


router.get('/github', passport.authenticate('github'));



// router.get('/google/callback',
//     passport.authenticate('google', {
//         successRedirect: '/secret',
//         failureRedirect: '/auth/google'
//     }));


router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    function (req, res) {
        // Successful authentication.
        //   res.json(req.user);
        res.send(respuesta(req.user));

    });


function respuesta(user) {
    return '<h1>Perfil</h1>'
       // + '<img src="' + user.photos[0].value + '">'
        + '<br>' + user.displayName
        + '<br> ID: ' + user.id
        + '<br> PROVEEDOR: <strong>' + user.provider + '</strong>'
        + '<br><br>'
        + '<a href="/">Ir a página de inicio</a>';
}

// router.get('/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect: '/secret',
//         failureRedirect: '/auth/facebook'
//     }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
    function (req, res) {
        // Successful authentication.
        res.send(respuesta(req.user));
    });


// router.get('/github/callback',
//     passport.authenticate('github', {
//         successRedirect: '/secret',
//         failureRedirect: '/auth/github'
//     }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/github' }),
    function (req, res) {
        // Successful authentication.
        // res.json(req.user);
        // console.log(req.user);
        res.send(respuesta(req.user));
    });

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(function () {
        res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/');
    });
});

module.exports = router;