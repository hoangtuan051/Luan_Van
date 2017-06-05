// var express = require('express');
// var router = express.Router();
var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

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
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('mainpage');
});


router.get('/search', function(req, res, next){
  var searches = req.query.searchword;
	console.log("params:" + req.query.searchword);
	console.log("Success");
	var fs = require('fs');
	var file = 'file.txt';
	var wstream = fs.createWriteStream(file);
	wstream.write(searches);
	wstream.end();

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
                res.render('mainpage', {data: json.doc.s.w});
                console.log('Done');
                //res.redirect('/top?search=' + req.body.searchword);
            });
        });
	});
});

router.get('/p/:tagId', function(req, res) {
  res.send("tagId is set to " + req.params.tagId);
});

router.get('/top', function(req, res, next){
  res.redirect('/');
});


router.post('/word', function(req, res, next){
  var temp = req.body.req;
  var key = "^" + temp;
  console.log("key:" + temp);

  pool.getConnection(function(err, connection){
    connection.query('select m.mean, m.example from meanva m, vaword v where m.wordid = v.id and v.word REGEXP BINARY "' + key + '"', function (error, results, fields) {
      if (error) {
        console.log('Error in the query');
        return;
      }
      console.log('Successful query');
      for(var i = 0; i < results.length; i++){
        console.log(results[i].mean);
      }

      res.send(results);
    });
    connection.release();
  });
});

module.exports = router;