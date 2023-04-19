var express = require('express');
var router = express.Router();

/* GET home page. */
// localhost:3000
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Ruxue Jin" });
});

router.get('/login',function(req,res){
  res.render('login',{title:"Login",js:["fetchAPI.js"]});
})
router.get('/index',function(req,res){
  res.render('index',{title:"Index",js:["fetchAPI.js"]});
})

router.get('/registration',function(req,res){
  res.render('registration',{title:"Registration",js:["validation.js"]});
})

router.get('/profile',function(req,res){
  res.render('profile',{title:"Profile"});
})
router.get('/postvideo',function(req,res){
  res.render('postvideo',{title:"PostVideo"});
})
router.get('/viewpost',function(req,res){
  res.render('viewpost',{title:"ViewPost"});
})
module.exports = router;
