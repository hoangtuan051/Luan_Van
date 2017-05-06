<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smartDictionary";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT idname, gender, age FROM user";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["idname"]. " - gender: " . $row["gender"]. " " . $row["age"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>