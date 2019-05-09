<?php
require '../vendor/autoload.php';
// I'm using SqliteConnection class to connect to Db and
use App\SqliteConnection as SqliteConnection;
use App\SQLiteDelete as SQLiteDelete;

$orderId=$_POST["orderId"];

// delete order from orderTbl
$sqlite = new SQLiteDelete( (new SqliteConnection()) -> connect());
$sqlite->deleteOrder($orderId);
?>
