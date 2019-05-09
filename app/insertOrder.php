<?php
require '../vendor/autoload.php';
// I'm using SqliteConnection class to connect to Db and
use App\SqliteConnection as SqliteConnection;
use App\SQLiteInsert as SQLiteInsert;

$buyerName=$_POST["buyerName"];
$buyerEmail=$_POST["buyerEmail"];
$buyerPhone=$_POST["buyerPhone"];
$buyerOrder=$_POST["buyerOrder"];

// insert order to orderTbl
$sqlite2 = new SQLiteInsert( (new SqliteConnection()) -> connect());
$lastInsertedId=$sqlite2->insertOrder($buyerName, $buyerEmail, $buyerPhone, $buyerOrder);
echo $lastInsertedId;
?>
