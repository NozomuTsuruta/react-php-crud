<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->title)){
    $insert = $db->prepare('INSERT INTO todos SET title=?,text=?');
    $insert -> execute(array($data->title,$data->text));
}

echo 'hello';