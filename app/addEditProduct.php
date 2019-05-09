<?php
require '../vendor/autoload.php';
// I'm using SqliteConnection class to connect to Db and
use App\SqliteConnection as SqliteConnection;
use App\SQLiteInsert as SQLiteInsert;
use App\SQLiteCreateTable as SQLiteCreateTable;
use App\SQLiteUpdate as SQLiteUpdate;

// collect data from front -end
$image = $_POST["image"];
$name = $_POST["name"];
$price = $_POST["price"];
$code = $_POST["code"];
$filter = $_POST["filter"];
$characteristics = $_POST["characteristics"];


// try to insert product
// else $testName not exists, so we must insert new product to table
$sqlite = new SQLiteInsert( (new SqliteConnection()) -> connect());
$result = $sqlite->insertProduct($name, $code, $image, $price, $filter, $characteristics);
error_log("\n addEditProduct: insert_result = $result  \n", 3, "d:/openserver/userdata/logs/PHP-5.6_error.log");

if($result==""){//if insert does NOT successufully
  //let's update already existed row
  $sqlite2 = new SQLiteUpdate( (new SqliteConnection()) -> connect());
  $sqlite2->updateTable($image, $name, $price, $code, $filter, $characteristics);
}
?>
