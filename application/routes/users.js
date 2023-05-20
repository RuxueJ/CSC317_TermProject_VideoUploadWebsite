var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');
var { isLoggedIn, isMyProfile } = require("../middleware/auth");
const { usernameCheck, passwordCheck, emailCheck, tosCheck, ageCheck, isUsernameUnique, isEmailUnique } = require('../middleware/validation');
const { getPostsForUserBy } = require('../middleware/posts');
// const { default: isEmailUnique } = require('validator/lib/isEmail');



/* GET localhost:3000/users/register */
router.post(
  '/register',
  usernameCheck,
  passwordCheck,
  emailCheck,
  // tosCheck,
  // ageCheck,
  isUsernameUnique,
  isEmailUnique,
  
  async function (req, res, next) {
    var { username, email, password } = req.body;
    try {
      // check username unique
      // check email unique

      var hasedPassword = await bcrypt.hash(password, 3);

      // insert

      var [resultObject, fields] = await db.execute(`insert into users
    (username, email, password) 
    value(?,?,?);`, [username, email, hasedPassword]);
      if (resultObject && resultObject.affectedRows == 1) {
        return res.redirect('/login');
      } else {
        return res.redirect('/register');
      }
    } catch (error) {
      next(error);
    }
  });

router.post('/login', async function (req, res, next) {
  var { username, password } = req.body;
  if (!username || !password) {
    req.flash("error", `Log in failed: invalid username or password`);
    req.session.save(function (err) {
      return res.redirect('/login');
    })
  } else {
    var [rows, fields] = await db.execute(`select id,username,password,
      email from users where username = ? ;`, [username]);
    var user = rows[0];
    if (!user) {
      req.flash("error", `Log in failed: username has not been registered`);
      req.session.save(function (err) {
        return res.redirect('/login');
      })
    } else {
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        req.session.user = {
          userID: user.id,
          email: user.email,
          username: user.username
        };
        req.flash("success", `You are now logged in`);
        req.session.save(function (err) {
          return res.redirect('/');
        })
      } else {
        req.flash("error", `Log in failed: password does not match`);
        return res.redirect('/login');
      }
    }
  }

});
// router.use("/profile/:id(\\d+",isMyProfile);
router.get("/profile/:id(\\d+)", isLoggedIn, isMyProfile, getPostsForUserBy, function (req, res) {
  res.render("profile", { title: "Profile" });
})

router.post("/logout", isLoggedIn, function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    }
    return res.redirect('/');
  })
})
module.exports = router;

