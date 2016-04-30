<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

$server = '176.32.230.27';
$username = 'cl49-sdp';
$password = 'poopoo';
$db = 'cl49-sdp';


function escapeJsonString($value) { # list from www.json.org: (\b backspace, \f formfeed)
    $escapers = array("\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c");
    $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b");
    $result = str_replace($escapers, $replacements, $value);
    return $result;
}

//get course
$data = json_decode(file_get_contents("php://input"));

$course = ($data->course);

$conn = new mysqli($server, $username, $password, $db);

$result = $conn->query("SELECT fileDest, title, description, author FROM notes WHERE course = '$course'");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {

  if ($outp != "") {$outp .= ",";}
  $outp .= '{"fileDest":"'  . ($rs["fileDest"]) . '",';
  $outp .= '"title":"'. escapeJsonString($rs["title"])     . '",';
    $outp .= '"description":"'.  escapeJsonString($rs["description"])     . '",';
  $outp .= '"author":"'. $rs["author"]  .  '"}';

}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo ($outp);



?>
