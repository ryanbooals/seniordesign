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
$courses = ($data->courses);
$count = 0;

//connect to DB
$conn =  mysql_connect($server, $username, $password);
mysql_select_db($db, $conn);

//clear all entries
mysql_query("DELETE FROM userCourses WHERE username = '$un'");

foreach ($courses as $course) {
  //echo '{"resp": "'  . $count . '"}';
  mysql_query("INSERT INTO userCourses (username, course) VALUES ( '$un', '$course');", $conn);

  # code...
}

echo ('{"resp": "Courses added successfully"}');

echo $outp;



?>
