<?php

//load.php

$connect = new PDO('mysql:host=localhost;dbname=club_langue', 'root', 'RootFor2019*');

$data = array();
$json = array();

$query = "SELECT * FROM calendar ORDER BY id";


//$sql = "select * from calendar";
//$query = mysql_query($sql);
//$result=mysqli_fetch_array($query);
$statement = $connect->prepare($query);

$statement->execute();

$result = $statement->fetchAll();

foreach($result as $row)
{
    $data[] = array(
        'id'   => $row['id'],
        'user_id'   => $row['user_id'],
        'ref_id'   => $row['ref_id'],
        'status'   => $row['status'],
        'time'     =>$row['time'],
        'language'    =>$row['language'],
        'type'     =>$row['type']
    );array_push($json,$data);

}
//console.log("{$data}");
echo json_encode($json);

?>