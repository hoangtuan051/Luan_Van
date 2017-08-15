var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
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
  connectionLmit  : 100,
  host            : '127.0.0.1',
  user            : 'root',
  password        : '',
  database        : 'dictionaryclc',
  debug           : false
});

var outputFile = '5.tagged.xml';
var outputFileav = 'output.xml';
var checked = true;
var users="";
/* GET home page. */

router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('mainpage', {users: users});
  }
  else{
    res.render('mainpage');
  }
});

router.get('/sentences', function(req, res, next) {
  res.render('sentences');
});

router.get('/searcheng', function(req, res, next){
  console.log('key ' + req.query.typeahead);
  pool.getConnection(function(err, connection){
    connection.query('select w.word, w.pos, m.mean, m.example from word w, meaningev m where w.wordid = m.wordid and w.word=' + '"' + req.query.typeahead + '"', function(error, results, fields){
      if(error){
        console.log('query error');
        return;
      }
      console.log('Successful query');
      for(var i = 0; i < results.length; i++){
         console.log(results[i].word + results[i].pos);
      }

      if(results.length > 0)
          res.render('result', {datadic: results, users: users});
      else
          res.render('noresult');
  });
  connection.release();
  });
});

router.get('/result', function(req, res){
    res.render('result');
});

router.get('/noresult', function(req, res){
    res.render('noresult');
});

router.get('/searchvie', function(req, res, next){
  console.log("key " + req.query.typeahead);
  pool.getConnection(function(err, connection){
    connection.query('select v.word , v.pos, m.mean, m.example from meanva m, vaword v where m.wordid = v.wordid and v.word LIKE CONCAT(' + '"%"' + ', CONVERT(' + '"' + req.query.typeahead + '"' + ', BINARY))', function (error, results, fields) {
      if (error) {
        console.log('Error in the query');
        return;
      }
      var dataSend = [];
      console.log('Successful query 1');
      for(var i = 0; i < results.length; i++){
        if(results[i].word === req.query.typeahead){
          console.log(results[i].word);
         dataSend.push(results[i]);
       }
      }
      if(dataSend.length > 0)
          res.render('result', {datadic: dataSend});
      else
          res.render('noresult');
  });
  connection.release();
  });
});

router.get('/search', function(req, res, next){
  console.log('test ' + req.query.key);
  pool.getConnection(function(err, connection){
    connection.query('SELECT word FROM word WHERE word LIKE "%' + req.query.key + '%"', function(error, results, fields){
      if(error) throw err;
      var data = [];
      for(var i = 0; i < results.length; i++){
        data.push(results[i].word);
      }
      res.send(JSON.stringify(data));
    });
    connection.release();
  });
});

router.get('/suggest', function(req, res, next){
  console.log('test ' + req.query.key);
  pool.getConnection(function(err, connection){
    connection.query('SELECT word FROM vaword WHERE word LIKE CONCAT(' + '"%"' + ', CONVERT(' + '"' + req.query.key + '"' + ', BINARY))', function(error, results, fields){
      if(error) throw err;
      var data = [];
      for(var i = 0; i < results.length; i++){
        data.push(results[i].word);
      }
      res.send(JSON.stringify(data));
    });
    connection.release();
  });
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
            console.log('Done');
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

router.get('/profiles', function(req, res){
  if(req.isAuthenticated()){
    res.render('profiles', {users: users});
  }
});

router.post('/updatepass', function(req, res){
  if(req.isAuthenticated){
    pool.getConnection(function(err, connection){
        connection.query('SELECT * FROM account where id = ' + users.id, function(err, results, fields){
          var oldpassword = req.body.oldpassword;
          var newpassword = req.body.newpassword;
          if(!bcrypt.compareSync(oldpassword, results[0].password)){
              res.render('changepassword', {errors: "Please verify your current password.", users: users});
              return;
          }
          newpassword = bcrypt.hashSync(newpassword, null, null);
          connection.query('UPDATE account SET password="' + newpassword + '"' + ' WHERE id=' + results[0].id, function(err){
              if(err){
                  console.log(err);
              }
              res.render('changepassword', {users: users});
              return;
          });
        });
        connection.release();
    });
  }
});

router.get('/changepassword', function(req, res){
  if(req.isAuthenticated()){
    res.render('changepassword', {users: users});
  }
});

router.get('/login', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login', { message: req.flash('loginMessage')});
});

router.get('/success', function(req, res){
  if(req.isAuthenticated()){
    res.render('success', {users: users});
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
      users = user;
      //console.log("fullname " + user.fullname);
      return res.redirect('/success');
    });
  })(req, res, next)
});

// router.get('/wordlists', function(req, res, next){
//     pool.getConnection(function(err, connection){
//       connection.query('SELECT * FROM where id=' + , function(err, results, fields){
//
//       });
//       connection.release();
//     });
// });

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
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/'
  })
);

// route for twitter authentication and login
// different scopes while logging in
router.get('/auth/twitter',
  passport.authenticate('twitter')
);

// handle the callback after facebook has authenticated the user
router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect : '/profile',
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
// Get google API
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  })
);

router.get('/profile', isLoggedIn, function(req, res) {
  users = req.user;
  res.render('mainpage', {
    users : req.user // get the user out of session and pass to template
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
