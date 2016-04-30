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

$result = $conn->query("SELECT postId, author, content, date FROM comments WHERE course = '$course'");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {

  if ($outp != "") {$outp .= ",";}
  $outp .= '{"postId":"'  . $rs["postId"] . '",';
  $outp .= '"Author":"'. $rs["author"]     . '",';
  $outp .= '"Content":"'. escapeJsonString($rs["content"])  .  '",';
  $outp .= '"Date":"'. $rs["date"]     . '"}';

}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo ($outp);



?>
