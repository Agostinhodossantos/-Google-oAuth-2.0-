const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require("passport");
var cookieSession = require('cookie-session')
require('./passport-setup');
require('./app');

app.use(cors())


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
    if(req.user) {
        next()
        console.log("next")
    } else {
        console.log("not loget")
        res.sendStatus(401);
    }
}


// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("you are not logged"))
app.get('/failed', (req, res) => res.send("You're failed to login"))
app.get('/good',isLoggedIn ,(req, res) =>{
    //uploadVideo(req.user, "title", "description", "tags") 

    res.send("Walcame mr "+req.user.displayName)
  
   })

app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
});

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect("/");
})


app.listen(3000, () => console.log("app listening on port"))