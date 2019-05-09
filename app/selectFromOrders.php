<?php
require '../vendor/autoload.php';
// I'm using SqliteConnection class to connect to Db and
// SQLiteCreateTable class to create new table
use App\SqliteConnection as SqliteConnection;
use App\SQLiteCreateTable as SQLiteCreateTable;
// connect to/create database
// and create new instance of SQLiteCreateTable class:
$sqlite = new SQLiteCreateTable( (new SqliteConnection()) -> connect());

// get content of podactsTbl
$content=$sqlite->getOrdersContent();

// pass $tables and $content to js
echo json_encode($content);
?>
