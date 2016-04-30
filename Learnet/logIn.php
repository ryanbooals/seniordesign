<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

//ini_set('display_errors', 'On');
//error_reporting(E_ALL | E_STRICT);


$server = '176.32.230.27';
$username = 'cl49-sdp';
$password = 'poopoo';
$db = 'cl49-sdp';

$data = json_decode(file_get_contents("php://input"));

$un = ($data->username);
$pw = ($data->password);

//$conn = new mysqli($server, $username, $password, $db);

$outp = '{"attempt":';


$conn =  mysql_connect($server, $username, $password);
mysql_select_db($db, $conn);


//mysql_query("INSERT INTO users (username, password) VALUES ( '$un', '$pw');", $conn);



/*
$result = $conn->query("SELECT username, password FROM users");

while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"un":"'  . $rs["username"] . '",';
      $outp .= '"pw":"'. $rs["password"]     . '"}';
}
$outp ='{"users":['.$outp.']}';
$conn->close();
*/


$result = mysql_query("SELECT * FROM users WHERE username='$un' LIMIT 1");


if(mysql_fetch_array($result) !== false)
{
    $outp .= '"E", "match":';

 //pasword encryption
 
  $pw = md5(md5($un), $pw);
    if (mysql_fetch_array(mysql_query("SELECT * FROM users WHERE password='$pw' LIMIT 1")))
      $outp .= '"matchPW"}';

    else
      $outp .= '"noMatchPW"}';
}
else
    $outp .= '"DNE", "match":"n/a"}';
/*
if(mysql_num_rows($result) > 0) {
      $outp .= '"E"}';
} else {
  $outp .= '"DNE"}';

}

*/

//$conn->close();
//$outp .= '"' . $un . '"}';
//$outp = json_encode($outp);

echo($outp);

?>
