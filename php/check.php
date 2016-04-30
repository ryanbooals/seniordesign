<?php
//streaming code

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$server = '176.32.230.27';
$username = 'cl49-sdp';
$password = 'poopoo';
$db = 'cl49-sdp';

$data = json_decode(file_get_contents("php://input"));
$course = ($data->course);

$conn =  mysqli_connect($server, $username, $password, $db);
$sql="SELECT course FROM notes";
	//mysql_query("INSERT INTO notes (`fileDest`, `title`, `description`, `author`, `course`) VALUES  ('$file_destination', '$title', '$description', '$author', '$course')", $conn);


  if ($result=mysqli_query($conn,$sql))
    {
      $fieldcount = 0;
      while($rs = $result->fetch_array(MYSQLI_ASSOC)) {

        $fieldcount++;
      }


    printf("Result set has %d fields.\n",$fieldcount);
    // Free result set
    //mysqli_free_result($result);
    echo "data: {$fieldcount}\n\n";
    }

mysqli_close($conn);
flush();


?>
