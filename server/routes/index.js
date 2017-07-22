// var express = require('express');
// var router = express.Router();
var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var passport = require('passport');
var checkWord = require('check-word'),
  words       = checkWord('en');

// var connection = mysql.createConnection({
//    host     : 'localhost',
//    user     : 'root',
//    password : '',
//    database : 'dictionary'
//  });

var pool = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'dictionaryclc'
});

var outputFile = '5.tagged.xml';
var outputFileav = 'output.xml';
var checked = true;
var users;
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('sentences');
});

router.get('/quizz', function(req, res, next){
  pool.getConnection(function(err, connection){
    connection.query('select wordid, selection, answer, question_text from quiz, questions where quiz.question_type = questions.question_type', function(err, results, fields){
      if(err){
        console.log('Error in the query');
        return;
      }
      console.log('Successful query');
      console.log('data:' + results.length);
      res.render('quizz', {listquizz: results});
    });
    connection.release();
  });
});

router.post('/word', function(req, res, next){
  var key = req.body.req;
  console.log("key:" + key);

  pool.getConnection(function(err, connection){
    if(checked === false){
      connection.query('select v.word ,m.mean, m.example, v.pos from meanva m, vaword v where m.wordid = v.id and v.word LIKE CONCAT(' + '"%"' + ', CONVERT(' + '"' + key + '"' + ', BINARY))', function (error, results, fields) {
        if (error) {
          console.log('Error in the query');
          return;
        }
        console.log('Successful query 1');
        for(var i = 0; i < results.length; i++){
          if(results[i].word === key && results[i].example != null)
           console.log(results[i].example);
        }
        res.send(results);
      });
    }
    else{
      connection.query('select w.word, w.pos, m.mean, m.example from word w, meaningev m where w.wordid = m.wordid and w.word=' + '"' + key  + '"', function(error, results, fields){
        if(error){
          console.log('query error');
          return;
        }
        console.log('Successful query');
        for(var i = 0; i < results.length; i++){
           console.log(results[i].word + results[i].pos);
        }
        res.send(results);
      });
    }
    connection.release();
  });
});

router.get('/searchav', function(req, res, next){
  var searches = req.query.searchword;
  console.log('Param:' + searches);
  console.log("Successful");

  var temp = searches.split(' ');
  for(var i = 0; i < temp.length; i++){
    if(words.check(temp[i]) === false && temp[i].length > 1)
    {
      console.log("viet");
      checked = false;
      break;
    }
    else{
      console.log("anh");
      checked = true;
    }
  }

  var fs = require('fs');
  var file = 'file.txt';
  var wstream = fs.createWriteStream(file);
  wstream.write(searches);
	wstream.end();

  if(checked === true){
    var arguments = [
      'models/english-left3words-distsim.tagger',
      file,
      outputFileav
    ];

    const spawn = require('child_process').spawn;
  	const bat = spawn('stanford-postagger.bat', arguments);

    bat.stdout.on('data', (data) => {
  	    console.log(data.toString());
  	});

  	bat.stderr.on('data', (data) => {
  	    console.log(data.toString());
  	});

    bat.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
      bat.kill();

      var json;
      var xml2js = require('xml2js'); // XML2JS Module
      var parser = new xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray : false, normalizeTags : true, preserveChildrenOrder : true});
      fs.readFile(outputFileav, function(err, data) {
        parser.parseString(data, function (err, result) {
            json = JSON.stringify(result);
            json = JSON.parse(json);
            console.log(json.pos.sentence.word);
            res.render('sentences', {data:json.pos.sentence.word, checkEn: checked});
              //res.json({Search: req.query.search})
            console.log('Done');
            //res.redirect('/top?search=' + req.body.searchword);
        });
      });
    });
  }
  else{
    var arguments = [
      '-i', file,
      '-o', outputFile
    ];

    const spawn = require('child_process').spawn;
    const bat = spawn('vnTagger.bat', arguments);

    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });


    bat.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
          bat.kill();

          var json;
          var xml2js = require('xml2js'); // XML2JS Module
          var parser = new xml2js.Parser({ignoreAttrs : false, mergeAttrs : true, explicitArray : false, normalizeTags : true, preserveChildrenOrder : true}); // Creating XML to JSON parser object
          // Reading and Parsing the file
          fs.readFile(outputFile, function(err, data) {
              parser.parseString(data, function (err, result) {
                  json = JSON.stringify(result);
                  json = JSON.parse(json);

                    //res.json({Search: req.query.search})
                  console.log(json.doc.s.w);
                  res.render('sentences', {data:json.doc.s.w, checkEn: checked});
                  console.log('Done');
                  //res.redirect('/top?search=' + req.body.searchword);
              });
          });
    });
  }
});

router.get('/login', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login', { message: req.flash('loginMessage') });
});

router.get('/success', function(req, res){
  if(req.isAuthenticated()){
    res.render('success', {info: users});
  }
  else{
    res.send("chua login");
  }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      console.log("login failed");
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      users = user.fullname;
      //console.log("fullname " + user.fullname);
      return res.redirect('/success');
    });
  })(req, res, next)
});

// process the login form
// router.post('/login', passport.authenticate('local-login', {
//         successRedirect : '/success', // redirect to the secure profile section
//         failureRedirect : '/login', // redirect back to the signup page if there is an error
//         failureFlash : true // allow flash messages
// }));
// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/register', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('register', { message: req.flash('signupMessage') });
});

// process the signup form
router.post('/register', passport.authenticate('local-signup', {
  successRedirect : '/login', // redirect to the secure profile section
  failureRedirect : '/register', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// route for facebook authentication and login
// different scopes while logging in
router.get('/login/facebook',
  passport.authenticate('facebook', { scope : 'email' }
));

// handle the callback after facebook has authenticated the user
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/sentences',
    failureRedirect : '/'
  })
);

// route for twitter authentication and login
// different scopes while logging in
router.get('/login/twitter',
  passport.authenticate('twitter')
);

// handle the callback after facebook has authenticated the user
router.get('/login/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect : '/sentences',
    failureRedirect : '/'
  })
);

/* GET Twitter View Page */
// router.get('/twitter', isAuthenticated, function(req, res){
//   res.render('sentences', { user: req.user });
// });

// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {
    user : req.user // get the user out of session and pass to template
  });
});

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

//route middleware to make sure
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
