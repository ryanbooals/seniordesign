<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

$server = '176.32.230.27';
$username = 'cl49-sdp';
$password = 'poopoo';
$db = 'cl49-sdp';

$data = json_decode(file_get_contents("php://input"));

$un = ($data->username);
$pw = ($data->password);

$conn =  mysql_connect($server, $username, $password);
mysql_select_db($db, $conn);


//mysql_query("INSERT INTO users (username, password) VALUES ( '$un', '$pw');", $conn);

//Check if username already esists
$result = mysql_query("SELECT * FROM users WHERE username='$un' LIMIT 1");

if(mysql_fetch_array($result) !== false)
{
  echo '{"resp": "Username Already Exists"}';
}
else
{
  $pw = md5(md5($un), $pw);
  mysql_query("INSERT INTO users (username, password) VALUES ( '$un', '$pw');", $conn);
  echo '{"resp": "Registration Succesfull"}';
}


//echo($outp);

?>
