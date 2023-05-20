var express = require('express');
const {isLoggedIn} = require('../middleware/auth');
const { getRecentPosts } = require('../middleware/posts');
var router = express.Router();

/* GET home page. */
// localhost:3000
router.get('/', getRecentPosts, function(req, res,next) {
  res.render('index', { title: 'CSC 317 App', name:"Ruxue Jin",js:["fetchAPI.js"] });
});

router.get('/login',function(req,res){
  res.render('login',{title:"Login"});
})
router.get('/index',function(req,res){
  res.render('index',{title:"Index",js:["fetchAPI.js"]});
})

router.get('/register',function(req,res){
  res.render('register',{title:"Registration",js:["validation.js"]});
})


router.get('/postvideo',isLoggedIn,function(req,res){
  res.render('postvideo',{title:"PostVideo"});
})


// router.get('/viewpost',function(req,res){
//   res.render('viewpost',{title:"ViewPost"});
// })

module.exports = router;
