<?php
require_once dirname(__FILE__) . '/DatabaseAccess.php';
/**
 * Description of TicketManager
 *
 * @author Marshall
 */
class TicketManager {
    private $database;
    private $projectData;
    private $priorityData;
    private $tickets;
    private $icons;

    public function  __construct() {
        date_default_timezone_set('America/Los_Angeles');
        $this->database = new DatabaseAccess('DatabaseTickets.php');
        $this->database->runQuery("SET time_zone = '-8:00';");
        $action = $this->getUrlParam('action');
        $type = $this->getUrlParam('type');
        if($action == 'startup') {
            $this->getProjectData();
            $this->getPriorityData();
            $this->getTickets();
            $this->getIcons();
            $data = array();
            $data['icons'] = $this->icons;
            $data['projects'] = $this->projectData;
            $data['priorities'] = $this->priorityData;
            $data['tickets'] = $this->tickets;
            $this->sendJSON(true, $data);
        } else if($type == 'ticket') {
            if($action == 'add') {
                $this->addTicket();
            } else if($action == 'update') {
                $this->updateTicket();
            } else if($action == 'remove') {
                $this->removeTicket();
            }
        } else if($type == 'project') {
            if($action == 'add') {
                $this->addProject();
            } else if($action == 'update') {
                $this->updateProject();
            } else if($action == 'remove') {
                $this->removeProject();
            }
        } else if($type == 'icon') {
            if($action == 'add') {
                $this->addIcon();
            }
        }
    }

    private function getProjectData() {
        $sql = 'SELECT id, name, icon_id AS icon FROM projects  ';
        $re = $this->database->getQueryAsAssociativeArray($sql);
        $this->projectData = $re;
    }

    private function getPriorityData() {
        $sql = 'SELECT * FROM priorities';
        $re = $this->database->getQueryAsAssociativeArray($sql);
        $this->priorityData = $re;
    }

    private function getTickets() {
        $sql = 'select id, project_id as projectId, UNIX_TIMESTAMP(created) as created, description, priority_id as priorityId, notes from tickets WHERE priority_id <> 6 order by priority_id ASC, created desc';
        $this->tickets = $this->database->getQueryAsAssociativeArray($sql);
    }
    
    private function getIcons() {
        $sql = 'select * from icons';
        $re = $this->database->getQueryAsAssociativeArray($sql);
        $icons = array();
        foreach($re as $icon) {
            $icons[] = intval($icon['id']);
        }
        $this->icons = $icons;
    }

    private function addTicket() {
        $projectId = $this->getUrlParam('project_id');
        $priorityId = $this->getUrlParam('priority_id');
        $description = $this->getUrlParam('description');
        $notes = $this->getUrlParam('notes');
        $time = time();
        $created = gmdate("Y-m-d H:i:s", $time);
        

        if($description != 'NULL') $sqlDescription = "'$description'";
        else $sqlDescription = $description;
        if($notes != 'NULL') $sqlNotes = "'$notes'";
        else $sqlNotes = $notes;
        $sql = "INSERT INTO tickets VALUES(NULL,$projectId,$priorityId,$sqlDescription,$sqlNotes,'$created')";
        $this->database->runQuery($sql);
        $newId = $this->database->getInsertId();
        if($notes =='NULL') {
            $notes = '';
        }
        $data = array('id' => $newId, 'created' => $time);
        $this->sendJSON(true, $data);

    }

    private function updateTicket() {
        $ticketId = $this->getUrlParam('id');
        $priorityId = $this->getUrlParam('priority_id');
        $sql = 'UPDATE tickets SET priority_id = ' . $priorityId . ' WHERE id = ' . $ticketId;
        $this->database->runQuery($sql);
        $this->sendJSON(true, null);
    }

    private function removeTicket() {
        $sql = 'DELETE FROM tickets WHERE id = ' . $this->getUrlParam('id');
        $this->database->runQuery($sql);
        $this->sendJSON(true, null);
    }
    
    private function addProject() {
        $name = $this->getUrlParam('name');
        $icon = $this->getUrlParam('icon_id');
        $this->database->runQuery("INSERT INTO projects VALUES(NULL,'$name', $icon)");
        $id = $this->database->getInsertId();
        $this->sendJSON(true, array('id' => $id));
    }
    
    private function updateProject() {
        $id = $this->getUrlParam('id');
        $name = $this->getUrlParam('name');
        $icon = $this->getUrlParam('icon_id');
        $this->database->runQuery("UPDATE projects SET name =  '$name', icon_id = $icon WHERE id = $id");
        
        $this->sendJSON(true, null);
    }
    
    private function removeProject() {
        $id = $this->getUrlParam('id');
        $sqlTickets = "DELETE FROM tickets WHERE project_id = $id";
        $sqlProject = "DELETE FROM projects WHERE id = $id";
        $this->database->runQuery($sqlTickets);
        $this->database->runQuery($sqlProject);
        
        $this->sendJSON(true, null);
    }
    
    private function addIcon() {
        $type = $_FILES['uploaded']['type'];
        $status = true;
        $id = null;
        if($type != 'image/png') {
            $status = false;
        } else {
            $this->database->runQuery('insert into icons VALUES(NULL)');
            $id = $this->database->getInsertId();
            $target = "../img/icons/" . $id . '.png'; 
         
        
            $status = move_uploaded_file($_FILES['uploaded']['tmp_name'], $target);
        }

        

        echo '<script type="text/javascript"> var icon = ';
        $this->sendJSON($status, array('id' => $id));
        
        echo '</script>';
    }

    private function getUrlParam($name) {
        if(isset($_GET[$name])) {
            return $this->database->escapeString($_GET[$name]);
        } else {
            return 'NULL';
        }
    }
    
    private function sendJSON($status, $data) {
        $json = array('status' => $status, 'data' => $data);
        echo json_encode($json);
    }
}

new TicketManager();
?>
