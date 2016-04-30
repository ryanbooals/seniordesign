<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


if(isset( $_FILES['file']))
{
    $file = $_FILES['file'];

	$title = $_POST["title"];
	$description = $_POST["description"];

  $author = $_POST["author"];
  $course = $_POST["course"];

    //File properties
    $file_name = $file['name'];
    $file_tmp = $file['tmp_name'];
    $file_size = $file['size'];
    $file_error = $file['error'];


    //file extension
    $file_ext = explode('.', $file_name);
    $file_ext = strtolower(end($file_ext));


    $allowed = array('txt','jpg', 'png', 'pdf');


    $file_destination = '';

    if(in_array($file_ext, $allowed))
    {
        if($file_error === 0)
        {
            if($file_size <= 2097152)
            {

                $file_name_new = uniqid('', true) . '.' . $file_ext;
		$file_destination = 'uploads/' . $file_name_new;

		if(move_uploaded_file($file_tmp, $file_destination))
		{
			//echo $file_destination;

		}
		else
		{
			echo '{}';
		}



            }
        }

    }


    $server = '176.32.230.27';
    $username = 'cl49-sdp';
    $password = 'poopoo';
    $db = 'cl49-sdp';

	$conn =  mysql_connect($server, $username, $password);
	mysql_select_db($db, $conn);



	mysql_query("INSERT INTO notes (`fileDest`, `title`, `description`, `author`, `course`) VALUES  ('$file_destination', '$title', '$description', '$author', '$course')", $conn);



	echo '{}';


}


//}
//else
//{

//handle BD Stuff



/*
mysql_query("INSERT IGNORE INTO testTags2 (tagNam) VALUES ('$tag0');", $conn);
mysql_query("INSERT IGNORE INTO testTags2 (tagNam) VALUES ('$tag1');", $conn);
mysql_query("INSERT IGNORE INTO testTags2 (tagNam) VALUES ('$tag2');", $conn);
mysql_query("INSERT IGNORE INTO testTags2 (tagNam) VALUES ('$tag3');", $conn);
mysql_query("INSERT IGNORE INTO testTags2 (tagNam) VALUES ('$tag4');", $conn);


mysql_query("INSERT IGNORE INTO coen11Notes (`fileDest`, `title`, `tag0`, `tag1`, `tag2`, `tag3`, `tag4`) VALUES ('ccbvc', '$title', '$tag0', '$tag1', '$tag2', '$tag3', '$tag4');", $conn);

*/


//}


?>
