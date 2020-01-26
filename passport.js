require('dotenv').config();
const config = require('./config.js');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const PinterestStrategy = require('passport-pinterest').Strategy;
const GithubStrategy = require('passport-github').Strategy;


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// GOOGLE
// https://console.developers.google.com/
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID_GOOGLE,
    clientSecret: process.env.CLIENTSECRET_GOOGLE,
    callbackURL: `https://${config.url}/auth/google/callback`
},
    (accessToken, refreshToken, profile, done) => done(null, profile)
));


// FACEBOOK
// https://developers.facebook.com/
passport.use(new FacebookStrategy({
    clientID: process.env.CLIENTID_FACEBOOK,
    clientSecret: process.env.CLIENTSECRET_FACEBOOK,
    callbackURL: `https://${config.url}/auth/facebook/callback`
},
    (accessToken, refreshToken, profile, done) => done(null, profile)
));


// GITHUB INTERNET
// https://github.com/settings/applications/new
passport.use(new GithubStrategy({
    clientID: process.env.CLIENTID_GITHUB,
    clientSecret: process.env.CLIENTSECRET_GITHUB,
    callbackURL: `https://${config.url}/auth/github/callback`
},
    (accessToken, refreshToken, profile, done) => done(null, profile)
));

