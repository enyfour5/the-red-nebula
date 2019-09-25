var express = require('express');
var router = express.Router();
var db = require('../models/db');
var bodyParser = require('body-parser');
const { body, check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register for a free account' });
});

router.post('/register', [ body('confirm_password').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
    }
    return true;
}),
  check('username').not().isEmpty().withMessage('please fill out username'),
  check('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i'),
  check('username', 'Username must be between 4-15 characters long.').isLength({min: 4, max: 14}),
  check('email', 'The email you entered is invalid, please try again.').isEmail(),
  check('email', 'Email address must be between 4-100 characters long, please try again.').isLength({min: 4, max: 100}),
  check('password', 'Password must be between 8-100 characters long.').isLength({min: 8, max: 100}),
  check('password', "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check('confirm_password', 'Password must be between 8-100 characters long.').isLength({min: 4, max: 100})
], function(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors.array() });
  }


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
