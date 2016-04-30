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



$outp = '{"attempt":';


$conn =  mysql_connect($server, $username, $password);
mysql_select_db($db, $conn);

$result = mysql_query("SELECT * FROM users WHERE username='$un' LIMIT 1");


if(mysql_fetch_array($result) !== false) //user exists
{
    $outp .= '"E", "match":';
    $pw = md5($pw); //unhash password

    if (mysql_fetch_array(mysql_query("SELECT * FROM users WHERE password='$pw' LIMIT 1")))
      $outp .= '"matchPW"}'; //password matches username

    else
      $outp .= '"noMatchPW"}'; //password did not matches
}

else
    $outp .= '"DNE", "match":"n/a"}';

echo($outp);

?>
