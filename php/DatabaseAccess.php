<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Description of DatabaseAccess
 *
 * @author Marshall
 */
class DatabaseAccess {

    private static $mysqli;
    private $result;
    
    private $dataTypes = array(
        1=> 'int', //tinyint',
        2=>'int', //smallint',
        3=>'int', //int',
        4=>'float', //float',
        5=>'float', //double',
        7=>'string', //timestamp',
        8=>'long', //bigint',
        9=>'long', //mediumint',
        10=>'string', //date',
        11=>'string', //time',
        12=>'string', //datetime',
        13=>'string', //year',
        16=>'int', //bit',
        252=>'string', //252 is currently mapped to all text and blob types (MySQL 5.0.51a)
        253=>'string', //varchar',
        254=>'string', //char',
        246=>'float' //decimal'
    );

    public function  __construct($credentialsFile) {

        require dirname(__FILE__) . '/' . $credentialsFile;
        
        $this->mysqli = new mysqli($host,
                                $username,
                                $password,
                                $name);
        if ($this->mysqli->connect_errno) {
            
            throw new Exception('Database Connection Error');
        }

    }

    public function runQuery($sql) {
        $this->runSQL($sql);
    }

    public function getQueryAsNumericArray($sql) {  
        return $this->convertResultToArray($sql, MYSQLI_NUM);
    }

    public function getQueryAsAssociativeArray($sql) {
        return $this->convertResultToArray($sql, MYSQLI_ASSOC);
    }

    private function runSQL($sql) {
        $sanitizedSql = $this->mysqli->real_escape_string($sql);
        $result = $this->mysqli->query($sql);

        if(!$result) {
            throw new Exception($this->mysqli->error . $sql);
        }
        $this->result = $result;
        
        return $result;
    }
    
    private function convertResultToArray($sql, $arrayType) {
        $resultArray = array();
        $singleResultRow;

        $result = $this->runSQL($sql);
        $fieldTypes = array();
        for($i = 0; $i < $result->field_count; $i++) {
            $data = $result->fetch_field_direct($i);
            if($arrayType == MYSQLI_ASSOC) {
                $fieldTypes[$data->name] = $data->type;
            } else {
                $fieldTypes[$i] = $data->type;
            }
        }

        while($singleResultRow = $result->fetch_array($arrayType)) {
            foreach($singleResultRow as $key => $column) {
                
                $column = stripslashes($column);
                if($column == 'NULL' || $column == 'null') {
                    $column = null;
                }
                if($column != null) {
                    
                    //echo $this->dataTypes[$fieldTypes[$key]] . " " . $key . " \n";
                    $column = call_user_func(array($this, $this->dataTypes[$fieldTypes[$key]]), $column);
        
                }
                $singleResultRow[$key] = $column;
                
            }
            array_push($resultArray, $singleResultRow);
        }
        
        return $resultArray;
    }

    public function getInsertId() {
        return $this->mysqli->insert_id;
    }

    public function getNumberOfRows() {
        return $this->result->num_rows;
    }

    public function getNumberOfAffectedRows() {
        return $this->mysqli->affected_rows;
    }

    public function  __destruct() {
        $this->mysqli->close();
    }
    
    public function escapeString($val) {
        return $this->mysqli->real_escape_string($val);
    }
    
    public static function int($val) {
        return intval($val);
    }
    
    public static function string($val) {
        return $val;
    }
    
    public static function long($val) {
        return intval($val);
    }
    
    public static function float($val) {
        return floatval($val);
    }

}






?>
