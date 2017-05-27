function writeToFile(data){
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var fh = fso.OpenTextFile("data.txt", 8, false, 0);
	fh.WriteLine(data);
	fh.Close();
}

var submit = document.getElementById("searchbutton");
submit.onclick = function () {
    var content = document.getElementById("searchbox").value;
    writeToFile(content);
}