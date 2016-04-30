<?php


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache");

$server = '176.32.230.27';
$username = 'cl49-sdp';
$password = 'poopoo';
$db = 'cl49-sdp';

$data = json_decode(file_get_contents("php://input"));

$title = ($data->title);
$author = ($data->author);
$content = ($data->content);
$course = ($data->course);


//connect to DB
$conn =  mysql_connect($server, $username, $password);
mysql_select_db($db, $conn);

//clear all entries
//mysql_query("DELETE FROM userCourses WHERE username = '$un'");

  mysql_query("INSERT INTO forums (title, author, content, course) VALUES ( '$title', '$author', '$content', '$course');", $conn);



echo ('{"resp": "Forum added successfully"}');

echo $outp;



?>
