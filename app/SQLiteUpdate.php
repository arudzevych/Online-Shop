<?php

namespace App;

/**
 * PHP SQLite Update Demo
 */
class SQLiteUpdate {

    /**
     * PDO object
     * @var \PDO
     */
    private $pdo;

    /**
     * Initialize the object with a specified PDO object
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /*
     * Mark a product specified by the $code
     */
    public function updateTable($image, $name, $price, $code, $filter, $characteristics) {
      // error_log("\n SQLiteUpdate:  image = $image, name = $name, price = $price, code = $code, filter = $filter, characteristics = $characteristics \n", 3, "d:/openserver/userdata/logs/PHP-5.6_error.log");

        // SQL statement to update status
        $sql = "UPDATE productTbl "
                . "SET product_name = :product_name, "
                . "product_image = :product_image, "
                . "product_price = :product_price, "
                . "product_filter = :product_filter, "
                . "product_characteristics = :product_characteristics "
                . "WHERE product_code = :product_code";

        $stmt = $this->pdo->prepare($sql);

        // passing values to the parameters
        $stmt->bindValue(':product_name', $name);
        $stmt->bindValue(':product_code', $code);
        $stmt->bindValue(':product_image', $image);
        $stmt->bindValue(':product_price', $price);
        $stmt->bindValue(':product_filter', $filter);
        $stmt->bindValue(':product_characteristics', $characteristics);

        // execute the update statement
        return $stmt->execute();
    }
}
?>
