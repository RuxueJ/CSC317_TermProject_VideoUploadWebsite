var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');



/* GET localhost:3000/users/register */
router.post('/register', async function (req, res, next) {
  var { username, email, password } = req.body;
  try {
    // check username unique
    var [rows, fields] = await db.execute(`select id from users 
    where username = ?;`, [username]);
    if (rows && rows.length > 0) {
      // window.alert("username has been registered.");
      return res.redirect('/register');
    }

    // check email unique
    var [rows, fields] = await db.execute(`select id from users 
    where email = ?;`, [email]);
    if (rows && rows.length > 0) {
      return res.redirect('/register');
    }
    var hasedPassword = await bcrypt.hash(password, 3);

    // insert

    var [resultObject, fields] = await db.execute(`insert into users
    (username, email, password) 
    value(?,?,?);`, [username, email, hasedPassword]);
    if (resultObject && resultObject.affectedRows) {
      return res.redirect('/login');
    } else {
      return res.redirect('/register');
    }
  } catch (error) {

  }
});

router.post('/login', async function (req, res, next) {
  var { username, password } = req.body;
  if (!username || !password) {
    return res.redirect('/login');
  } else {
    var [rows, fields] = await db.execute(`select id,username,password,
      email from users where username = ? ;`, [username]);
    var user = rows[0];
    if (!user) {
      req.flash("error",`Log in failed: invalid username or password`);
      req.session.save(function(err){
        return res.redirect('/login');
    })
    } else {
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        req.session.user = {
          userID: user.id,
          email:user.email,
          username: user.username
        };
        req.flash("success",`You are now logged in`);
        req.session.save(function(err){
        return res.redirect('/');
      })
      } else {
        return res.redirect('/login');
      }
    }
  }

});
router.get('/profile',function(req,res){
  res.render('profile',{title:"Profile"});
})
router.post("/logout", function (req, res, next) {
  req.session.destroy(function(err){
    if(err){
      next(err);
    }
    return res.redirect('/');
  })
})
module.exports = router;

