<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

$server = '176.32.230.27';
$username = 'cl49-sdp';
$password = 'poopoo';
$db = 'cl49-sdp';


//get username
$data = json_decode(file_get_contents("php://input"));
$un = ($data->username);

$conn = new mysqli($server, $username, $password, $db);

$result = $conn->query("SELECT course FROM userCourses WHERE username = '$un'");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {

  if ($outp != "") {$outp .= ",";}
  $outp .= '"'  . $rs["course"] . '"';

}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo ($outp);



?>
