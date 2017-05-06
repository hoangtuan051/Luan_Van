// var express = require('express');
// var router = express.Router();
var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// router.get('/',function(req, res, next) {
//  // res.sendFile(path.join(__dirname,'../src/mainpage.html'));
//  console.log('Successful query');
// });

router.get('/',function(req, res, next) {
 
var temp = "abc";

//sql
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'dictionary'
});



connection.connect(function(err) {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT * FROM word', function (error, results, fields) {
  if (!!error) {
  	console.log('Error in the query');
  	return;
  }
  console.log('Successful query');
  console.log(results);
  //temp = results[0].idname;

	//res.send(temp);
});

connection.end();
});
// var execFile = require('child_process').execFile;

// var path ='E:\\LinhTinh\\ToolsandData\\CLC_VN_WS';

// execFile('oplrun',['clcvnws.exe','-o','"test\\WS.test.out"','"test\\WS.test.notTT.txt"'], function(err, data) {
//         if(err) {
//             console.log(err)
//         } 
//         else 
//         console.log(data.toString());                       
//     }); 



// var spawn = require('child_process').spawn,
//     child    = spawn('D:\\Luan_Van\\server\\ToolsandData\\CLC_VN_WS\\clcvnws.exe',
//     	['-o','"D:\\Luan_Van\\server\\ToolsandData\\CLC_VN_WS\\test\\WS.test.out"','"D:\\Luan_Van\\server\\ToolsandData\\CLC_VN_WS\\test\\WS.test.notTT.txt"']);

// child.stdout.on('data', function (data) {
//   console.log('stdout: ' + data);
// });

// child.stderr.on('data', function (data) {
//   console.log('stderr: ' + data);
// });

// child.on('close', function (code) {
//   console.log('child process exited with code ' + code);
//});

module.exports = router;
