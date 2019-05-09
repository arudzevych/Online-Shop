<?php
require '../vendor/autoload.php';
// I'm using SqliteConnection class to connect to Db and
use App\SqliteConnection as SqliteConnection;
use App\SQLiteInsert as SQLiteInsert;
// inicialize table with content
$sqlite2 = new SQLiteInsert( (new SqliteConnection()) -> connect());
$characteristicsArr = array("картопля","масло","молоко","петрушка");
$characteristics = json_encode($characteristicsArr);
// пюре
$sqlite2->insertProduct("пюре картопляне", "puree", "<img src=\"images\image-1.jpeg\" class=\"image\" alt=\"пюре\">", "55грн", "main_dishes", $characteristics);
// піцца
$characteristicsArr = array("тісто","томати","сир","оливки");
$characteristics = json_encode($characteristicsArr);
$sqlite2->insertProduct("піцца", "pizza", "<img src=\"images\image-2.jpg\" class=\"image\" alt=\"піцца\">", "60грн", "main_dishes", $characteristics);
// бургер
$characteristicsArr = array("булка","томати","салат","м'ясо");
$characteristics = json_encode($characteristicsArr);
$sqlite2->insertProduct("бургер", "burger", "<img src=\"images\image-3.png\" class=\"image\" alt=\"бургер\">", "60грн", "main_dishes", $characteristics);
// ковбаса
$characteristicsArr = array("пшениця");
$characteristics = json_encode($characteristicsArr);
$sqlite2->insertProduct("ковбаса", "kovbasa", "<img src=\"images\image-4.jpg\" class=\"image\" alt=\"ковбаса\">", "65грн", "main_dishes", $characteristics);

?>
