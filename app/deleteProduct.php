<?php
require '../vendor/autoload.php';
// I'm using SqliteConnection class to connect to Db and
use App\SqliteConnection as SqliteConnection;
use App\SQLiteDelete as SQLiteDelete;


// collect data from front -end
$code = $_POST["code"];

// delete order from orderTbl
$sqlite = new SQLiteDelete( (new SqliteConnection()) -> connect());
$sqlite->deleteProduct($code);
//echo $lastInsertedId;
?>
