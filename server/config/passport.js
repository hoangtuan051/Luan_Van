var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy   = require('passport-facebook').Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
var configAuth = require('./auth');
connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM account WHERE id = ? ",[id], function(err, rows){
            console.log("Dsds");
            done(err, rows);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
          var fullname = req.body.fullname;
          var phone = req.body.phone;
          var address = req.body.address;
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM account WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }
                else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        fullname: fullname,
                        username: username,
                        password: bcrypt.hashSync(password, null, null), // use the generateHash function in our user model
                        phone: phone,
                        address: address,
                        id_social: null
                    };

                    var insertQuery = "INSERT INTO account ( fullname, username, password, phone, address, id_social) values (?,?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.fullname, newUserMysql.username, newUserMysql.password, newUserMysql.phone, newUserMysql.address, newUserMysql.id_social],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM account WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },
    //facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      //asynchronous
      process.nextTick(function() {
        //find the user in the database based on their facebook id
        connection.query("SELECT * FROM account WHERE id_social = ?", [profile.id], function(err, rows){
            //if there is an error, stop everthing and return that
            //ie an error connecting to the database
            if(err){
                console.log("hhshshs");
                return done(err);
              }
            if(rows.length){
                console.log("hhshshs");
                return done(null, rows);//user found, return that user
            }
            else{ //if there is no user found with that facebook id, create them
                var newUser = {
                    id: profile.id,
                    email: profile.emails[0].value,
                    name: profile.name.givenName + ' ' + profile.name.familyName
                };

                var insertQuery = "INSERT INTO account (fullname, username, password, phone, address, id_social) values (?,?,?,?,?,?)";
                connection.query(insertQuery,[newUser.name, newUser.email, null, null, null, newUser.id],function(err, rows) {
                    if(err){
                        console.log("hhshshs");
                        throw err;
                    }
                    //if successful, return new user
                    newUser.id = rows.insertId;
                    return done(null, newUser);
                });
            }
        });
      });
    })
    );

  //   passport.use('twitter', new TwitterStrategy({
  //     consumerKey     : configAuth.twitterAuth.consumerKey,
  //     consumerSecret  : configAuth.twitterAuth.consumerSecret,
  //     callbackURL     : configAuth.twitterAuth.callbackURL
  //   },
  //   function(token, tokenSecret, profile, done) {
  //   // make the code asynchronous
  //   // User.findOne won't fire until we have all our data back from Twitter
  //     process.nextTick(function() {
  //
  //       // User.findOne({ 'twitter.id' : profile.id },
  //       //   function(err, user) {
  //       //   // if there is an error, stop everything and return that
  //       //   // ie an error connecting to the database
  //       //     if (err)
  //       //       return done(err);
  //       //
  //       //     // if the user is found then log them in
  //       //     if (user) {
  //       //       return done(null, user); // user found, return that user
  //       //     } else {
  //       //        // if there is no user, create them
  //       //        var newUser = new User();
  //       //
  //       //        // set all of the user data that we need
  //       //        newUser.twitter.id = profile.id;
  //       //        newUser.twitter.token = token;
  //       //        newUser.twitter.username = profile.username;
  //       //        newUser.twitter.displayName = profile.displayName;
  //       //        newUser.twitter.lastStatus = profile._json.status.text;
  //       //
  //       //        // save our user into the database
  //       //        newUser.save(function(err) {
  //       //          if (err)
  //       //            throw err;
  //       //          return done(null, newUser);
  //       //        });
  //       //     }
  //       //  });
  //     });
  //   })
  // );
};
