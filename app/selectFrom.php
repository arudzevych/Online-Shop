<?php
require '../vendor/autoload.php';
// image source
$img_source = '../images/image-1.jpeg';

// pass $img_source to js (to front-end)
echo json_encode($img_source);
?>
