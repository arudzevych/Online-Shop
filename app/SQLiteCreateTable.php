<?php

namespace App;

/**
 * SQLite Create Table Demo
 */
class SQLiteCreateTable {

    /**
     * PDO object
     * @var \PDO
     */
    private $pdo;

    /**
     * connect to the SQLite database
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * create tables
     */
    public function createTables() {
        $commands =[
            'CREATE TABLE IF NOT EXISTS productTbl (
                    product_name  TEXT NOT NULL,
                    product_code  TEXT PRIMARY KEY NOT NULL,
                    product_image TEXT NOT NULL,
                    product_price TEXT NOT NULL,
                    product_filter TEXT NOT NULL,
                    product_characteristics TEXT NOT NULL)',
            'CREATE TABLE IF NOT EXISTS ordersTbl (
                    buyer_id INTEGER PRIMARY KEY NOT NULL,
                    buyer_name  TEXT NOT NULL,
                    buyer_email  TEXT NOT NULL,
                    buyer_phone TEXT NOT NULL,
                    buyer_order TEXT NOT NULL)'
                  ];
        // execute the sql commands to create new tables
        foreach ($commands as $command) {
            $this->pdo->exec($command);
        }
    }
    /**
     * get the table list in the database
     */
    public function getTableList() {

        $stmt = $this->pdo->query("SELECT name
                                   FROM sqlite_master
                                   WHERE type = 'table'
                                   ORDER BY name");
        $tables = [];
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $tables[] = $row['name'];
        }

        return $tables;
    }
    /**
     * get the table content
     */
    public function getTableContent() {

        $stmt = $this->pdo->query("SELECT *
                                   FROM productTbl");
        $content = [];
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $names[] = $row['product_name'];
            $codes[] = $row['product_code'];
            $images[] = $row['product_image'];
            $prices[] = $row['product_price'];
            $filters[] = $row['product_filter'];
            $characteristics[] = $row['product_characteristics'];
        }
          $content = array($names, $codes, $images, $prices, $filters, $characteristics);

        return $content;
    }
    /**
     * get the ordersTbl content
     */
    public function getOrdersContent() {

        $stmt = $this->pdo->query("SELECT *
                                   FROM ordersTbl");
        $content = [];
        $ids = [];
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $ids[] = $row['buyer_id'];
            $names[] = $row['buyer_name'];
            $emails[] = $row['buyer_email'];
            $phones[] = $row['buyer_phone'];
            $orders[] = $row['buyer_order'];
        }
        $content=[];
        if(count($ids)!=0){
          $content = array($ids, $names, $emails, $phones, $orders);
        }

        return $content;
    }
    /**
     * get the productTbl names where product_code == $code
     */
     public function getNameByCode($code) {

         $stmt = $this->pdo->query("SELECT *
                                    FROM productTbl where product_code={$code}");
         $content = [];
         while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
             $names[] = $row['product_name'];
         }

         return $names;
     }
}
