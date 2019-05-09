<?php

namespace App;

/**
 * PHP SQLite Insert Demo
 */
class SQLiteInsert {

    /**
     * PDO object
     * @var \PDO
     */
    private $pdo;

    /**
     * Initialize the object with a specified PDO object
     * @param \PDO $pdo
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Insert a new product into the products table
     */
    public function insertProduct($productName, $productCode, $productImage, $productPrice, $productFilter, $productCharacteristics) {
        //error_log(" \n SQLiteInsert: productName=$productName, productCode=$productCode, productImage=$productImage, productPrice=$productPrice, productFilter = $productFilter, productCharacteristics = $productCharacteristics \n ", 3, "d:/openserver/userdata/logs/PHP-5.6_error.log");

        $sql = 'INSERT INTO productTbl(product_name,product_code,product_image,product_price,product_filter,product_characteristics)'
                . 'VALUES(:product_name,:product_code,:product_image,:product_price,:product_filter,:product_characteristics)';

        $stmt = $this->pdo->prepare($sql);
      $myResult = $stmt->execute([
            ':product_name' => $productName,
            ':product_code' => $productCode,
            ':product_image' => $productImage,
            ':product_price' => $productPrice,
            ':product_filter' => $productFilter,
            'product_characteristics' => $productCharacteristics
        ]);

        return $myResult;
    }
    /**
     * Insert a new product into the products table
     */
    public function insertOrder($buyerName, $buyerEmail, $buyerPhone, $buyerOrder) {
       // error_log("\n SQLiteInsert: buyerName=$buyerName, buyerEmail=$buyerEmail, buyerPhone=$buyerPhone, buyerOrder=$buyerOrder \n", 3, "c:/openserver/userdata/logs/PHP-5.6_error.log");

        $sql = 'INSERT INTO ordersTbl(buyer_name,buyer_email,buyer_phone,buyer_order)'
                . 'VALUES(:buyer_name,:buyer_email,:buyer_phone,:buyer_order)';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':buyer_name' => $buyerName,
            ':buyer_email' => $buyerEmail,
            ':buyer_phone' => $buyerPhone,
            ':buyer_order' => $buyerOrder,
        ]);

        return $this->pdo->lastInsertId();
    }
}
?>
