var express = require('express');
var router = express.Router();
var db = require('../models/db');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register for a free account' });
});

router.post('/register', function(req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
  var today = new Date();
  var confirmPassword = req.body.confirm_password;
  var userData = {
    "username": req.body.username,
    "email":req.body.email,
    "password":req.body.password,
    "created":today
  };
  var user = userData;

  bcrypt.hash(user.password, 10, function(err, hash) {
    if(err) console.log(err);
    user.password = hash;
    bcrypt.compare(confirmPassword, hash, function(err, isMatch) {
      if (err) {
        throw err
      } else if (!isMatch) {
        console.log("Password doesn't match!")
      } else {
        console.log("Password matches!")
        db.getConnection((connectionErr, connection) => {
          if (connectionErr) throw connectionErr;
          connection.query('INSERT INTO users SET ? ', user, (queryErr, result) => {
            connection.release();
            if (queryErr) throw queryErr;
            console.log('SUCCESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
            console.log(result);
          });
        });
      }
    })

  });
  res.redirect('/');
});

module.exports = router;
