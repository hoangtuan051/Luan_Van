// var express = require('express');
// var router = express.Router();
var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var mysql      = require('mysql');

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'dictionary'
 });

var pool = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'dictionary'
});


var outputFile = '5.tagged.xml';
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('mainpage');
});

// router.get('/',function(req, res, next) {
//  	res.sendFile(path.join(__dirname,'../src/mainpage.html'));
//  console.log('Successful query');
// });

router.post('/trans', function(req, res){
    console.log(req.body.searchword);
    console.log("Success");
    res.send(JSON.stringify(req.body.searchword));
});

router.post('/top', function(req, res){
	console.log(req.body.searchword);
	console.log("Success");
	var fs = require('fs');
	var file = 'file.txt';
	var wstream = fs.createWriteStream(file);
	wstream.write(req.body.searchword);
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
                
                res.render('mainpage', {data: json.doc.s.w});
                console.log('Done');
            });
        });
	});
});


router.post('/word', function(req, res, next){
  var key = req.body.req;
  console.log("key:" + key);
  var result = [];
   // var word = req.param();
  pool.getConnection(function(err, connection){
    connection.query('select m.mean from meanva m, vietanh v where m.wordid = v.wordid and v.word = "'+ key + '"', function (error, results, fields) {
      if (error) {
        console.log('Error in the query');
        return;
      }
      console.log('Successful query');
      console.log(results);

      for(var i = 0; i < results.length; i++){
        result[i] = results[i].mean;
      }

      console.log("key:" + key);

      console.log(result);

      //res.render('mainpage', {wordtype: result});
      res.send(result);
      
    });
    connection.release();
  });

  
  //res.send(str);

});

module.exports = router;