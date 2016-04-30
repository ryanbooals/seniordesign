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
$course = ($data->course);
$count = 0;

//connect to DB
$conn =  mysql_connect($server, $username, $password);
mysql_select_db($db, $conn);

//clear all entries
mysql_query("DELETE FROM userCourses WHERE username = '$un' AND course = '$course'");


echo ('{"resp": "Courses removed successfully"}');

echo $outp;



?>
