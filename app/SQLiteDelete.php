<?php

namespace App;

/**
 * PHP SQLite Insert Demo
 */
class SQLiteDelete {

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
        $pdo->setAttribute( $pdo::ATTR_ERRMODE, $pdo::ERRMODE_WARNING );
    }


    /**
     * delete order from ordersTbl
     */
    public function deleteOrder($orderId) {
     //error_log("\n SQLiteDelete: orderId = $orderId \n", 3, "d:/openserver/userdata/logs/PHP-5.6_error.log");
        $sql = 'delete from ordersTbl where rowid = :order_id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':order_id' => $orderId
        ]);

       $eroor = $stmt->errorInfo();
    }

     /**
     * delete product from ordersTbl
     */
    public function deleteProduct($code) {
        //error_log("\n SQLiteDelete: orderId = $orderId \n", 3, "d:/openserver/userdata/logs/PHP-5.6_error.log");
           $sql = 'delete from productTbl where product_code = :product_code';
   
           $stmt = $this->pdo->prepare($sql);
           $stmt->execute([
               ':product_code' => $code
           ]);
   
          $eroor = $stmt->errorInfo();
       }

}
?>
