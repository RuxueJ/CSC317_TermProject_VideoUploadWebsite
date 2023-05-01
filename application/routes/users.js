var express = require('express');
var router = express.Router();
var db = require('../conf/database');
/* GET localhost:3000/users/register */
router.post('/register', async function(req, res, next) {
  var {username, email, password} = req.body;
  try {
    // check username unique
    var [rows, fields] = await db.execute(`select id from users 
    where username = ?;`,[username]);
    if(rows && rows.length > 0){
      // window.alert("username has been registered.");
      return res.redirect('/register');
      
    }

    // check email unique
    var [rows, fields] = await db.execute(`select id from users 
    where email = ?;`,[email]);
    if(rows && rows.length > 0){
      return res.redirect('/register');
  
    }

    // insert

    var [resultObject, fields] = await db.execute(`insert into users(username, email, password) 
    value(?,?,?);`,[username, email,password]);
    if(resultObject && resultObject.affectedRows){
      return res.redirect('/login');
    }else{
      return res.redirect('/register');
    }
  } catch (error) {
    
  }
});

router.post('/login', async function(req, res, next) {
  var {username, password} = req.body;
  try {
    // check username unique
    var [rows, fields] = await db.execute(`select id from users 
    where username = ? and password = ?;`,[username, password]);
    if(rows == 0){
      return res.redirect('/login');
    }else{
      return res.redirect('/postvideo');
    }
  } catch (error) {
  }
});
module.exports = router;
