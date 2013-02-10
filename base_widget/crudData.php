<?php

include 'db_helper.php';

function readCurrentUsername() {
	global $_USER;
	echo json_encode($_USER['uid']);
} 

function readAllEmails() {
  $messageArray = array();
	$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';
	$username = 'clubconnectiongt@gmail.com';
	$password = 'mobilitykaisoku';
	$inbox = imap_open($hostname,$username,$password,OP_READONLY) or die('Cannot connect to Gmail: ' . imap_last_error());
	$emails = imap_search($inbox, ALL);
	if($emails){
		$limit = 0;
		foreach($emails as $email_number){
			$overview = imap_fetch_overview($inbox,$email_number,0);
			$message = imap_fetchbody($inbox, $email_number,"1");
			$message = imap_utf8($message);
			$message = strip_tags($message);
			$message = nl2br($message);
      			$messageArray[$limit] = $overview;
			$messageArray[$limit+1] = $message;
        		//echo json_encode($message);
			$limit+=2;
			if($limit === 10)
			break;
		}
	}
	imap_close($inbox);
  echo json_encode($messageArray);
}

function readEmailsFrom($senderEmail) {
	$messageArray = array();
	$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';
	$username = 'clubconnectiongt@gmail.com';
	$password = 'mobilitykaisoku';
	$inbox = imap_open($hostname,$username,$password,OP_READONLY) or die('Cannot connect to Gmail: ' . imap_last_error());
	$emails = imap_search($inbox, "FROM $senderEmail");
	if($emails){
		$limit = 0;
		foreach($emails as $email_number){
			$overview = imap_fetch_overview($inbox,$email_number,0);
			$message = imap_fetchbody($inbox, $email_number,"1");
			$message = imap_utf8($message);
			$message = strip_tags($message);
			//$message = nl2br($message);
			//echo json_encode($message);
			$messageArray[$limit] = $overview;
			$messageArray[$limit+1] = $message;
			$limit+=2;
			if($limit === 10)
			break;
		}
	}
	imap_close($inbox);
	header("Content-type: application/json");
	echo json_encode($messageArray);
}



function createEvent($groupID, $title, $description, $startTime, $endTime, $locationName, $locationID, $eventTypeID, $lastModified) {
	
	$dbQuery = sprintf("INSERT INTO `Event` (`GroupID`, `Title`, `Description`, `StartTime`, `EndTime`, `LocationName`, `LocationID`, `EventTypeID`, `LastModified`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');", 
		mysql_real_escape_string($groupID),
		mysql_real_escape_string($title),
		mysql_real_escape_string($description), 
		mysql_real_escape_string($startTime), 
		mysql_real_escape_string($endTime),
		mysql_real_escape_string($locationName),
		mysql_real_escape_string($locationID),
		mysql_real_escape_string($eventTypeID),
		mysql_real_escape_string($lastModified));

	$result = getDBResultInserted($dbQuery, 'EventID');

	header("Content-type: application/json");
	echo json_encode($result);
	
}

function readEvent($eventID) {

	$dbQuery = sprintf("SELECT * FROM `Event` WHERE `EventID`='%s';", mysql_real_escape_string($eventID));

	$result=getDBResultRecord($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
	
}

function readAllEvents() {

	$dbQuery = sprintf("SELECT * FROM `Event` ORDER BY `Title`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
	
}

function updateEvent($eventID, $title, $description, $startTime, $endTime, $locationName, $locationID, $eventTypeID) {

	$dbQuery = sprintf("UPDATE `Event` SET `Title`='%s',`Description`='%s',`StartTime`='%s',`EndTime`='%s',`LocationName`='%s',`LocationID`='%s',`EventTypeID`='%s' WHERE `EventID`='%s';", 
		mysql_real_escape_string($title),
		mysql_real_escape_string($description), 
		mysql_real_escape_string($startTime), 
		mysql_real_escape_string($endTime),
		mysql_real_escape_string($locationName),
		mysql_real_escape_string($locationID),
		mysql_real_escape_string($eventTypeID),
		mysql_real_escape_string($eventID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}


function deleteEvent($eventID) {

	$dbQuery = sprintf("DELETE FROM `Event` WHERE `EventID` = '%s';", mysql_real_escape_string($eventID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
	
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createUser($GTusername, $firstName, $lastName, $email) {

  global $_USER;
	//echo "TESTING FOR USER ID: " . $_USER['uid'] . "    @@";
	$GTusername = $_USER['uid'];
	
	$dbQuery = sprintf("INSERT INTO `User` (`GTusername`, `FirstName`, `LastName`, `Email`) VALUES ('%s', '%s', '%s', '%s');", 
		mysql_real_escape_string($GTusername),
		mysql_real_escape_string($firstName), 
		mysql_real_escape_string($lastName), 
		mysql_real_escape_string($email));

	$result = getDBResultInserted($dbQuery, 'UserID');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readUser($userID) {

	$dbQuery = sprintf("SELECT * FROM `User` WHERE `UserID`='%s';", mysql_real_escape_string($userID));

	$result=getDBResultRecord($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllUsers() {
	
	$dbQuery = sprintf("SELECT * FROM `User`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}


function updateUser($userID, $GTusername, $firstName, $lastName, $email) {

	$dbQuery = sprintf("UPDATE `User` SET `GTusername`='%s',`FirstName`='%s',`LastName`='%s',`Email`='%s' WHERE `UserID`='%s';", 
		mysql_real_escape_string($GTusername),
		mysql_real_escape_string($firstName), 
		mysql_real_escape_string($lastName), 
		mysql_real_escape_string($email), 
		mysql_real_escape_string($userID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

function deleteUser($userID) {

	$dbQuery = sprintf("DELETE FROM `User` WHERE `UserID` = '%s';", mysql_real_escape_string($userID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createUserToGroup($userID, $groupID, $groupAdmin) {
	
	$dbQuery = sprintf("INSERT INTO `UserToGroup` (`UserID`, `GroupID`, `GroupAdmin`) VALUES ('%s', '%s', '%s');", 
		mysql_real_escape_string($userID),
		mysql_real_escape_string($groupID),
		mysql_real_escape_string($groupAdmin));

	$result = getDBResultInserted($dbQuery, 'UserGroupID');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readUserToGroup($userID) {

	$dbQuery = sprintf("SELECT * FROM `UserToGroup` WHERE `UserID`='%s';", mysql_real_escape_string($userID));

	$result=getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllUserToGroups() {
	
	$dbQuery = sprintf("SELECT * FROM `UserToGroup`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function updateUserToGroup($userGroupID, $groupAdmin) {

	$dbQuery = sprintf("UPDATE `UserToGroup` SET `GroupAdmin`='%s' WHERE `UserGroupID`='%s';", 
		mysql_real_escape_string($groupAdmin), 
		mysql_real_escape_string($userGroupID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

function deleteUserToGroup($userGroupID) {

	$dbQuery = sprintf("DELETE FROM `UserToGroup` WHERE `UserGroupID` = '%s';", mysql_real_escape_string($userGroupID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createGroup($name, $description, $email) {

	$dbQuery = sprintf("INSERT INTO `Group` (`Name`, `Description`, `Email`) VALUES ('%s', '%s', '%s');", mysql_real_escape_string($name), mysql_real_escape_string($description), mysql_real_escape_string($email));

	$result = getDBResultInserted($dbQuery, 'GroupId');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readGroup($groupID) {

	$dbQuery = sprintf("SELECT * FROM `Group` WHERE `GroupID`='%s';", mysql_real_escape_string($groupID));

	$result=getDBResultRecord($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllGroups() {

	$dbQuery = sprintf("SELECT * FROM `Group` ORDER BY `Name`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function updateGroup($groupID, $name, $description, $email) {

	$dbQuery = sprintf("UPDATE `Group` SET `Name`='%s',`Description`='%s',`Email`='%s' WHERE `GroupID`='%s';", 
		mysql_real_escape_string($name), 
		mysql_real_escape_string($description), 
		mysql_real_escape_string($email), 
		mysql_real_escape_string($groupID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

function deleteGroup($groupID){
	
	$dbQuery = sprintf("DELETE FROM `Group` WHERE `GroupID` = '%s';", mysql_real_escape_string($groupID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}


/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createOrganizerRequest($userID, $groupID) {
	
	$dbQuery = sprintf("INSERT INTO `OrganizerRequest` (`UserID`, `GroupID`) VALUES ('%s', '%s');", 
		mysql_real_escape_string($userID),
		mysql_real_escape_string($groupID));

	$result = getDBResultInserted($dbQuery, 'OrganizerRequestID');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readOrganizerRequest($groupID) {

	$dbQuery = sprintf("SELECT * FROM `OrganizerRequest` WHERE `GroupID`='%s';", mysql_real_escape_string($groupID));

	$result=getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllOrganizerRequests() {
	
	$dbQuery = sprintf("SELECT * FROM `OrganizerRequest`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}


function deleteOrganizerRequest($organizerRequestID) {

	$dbQuery = sprintf("DELETE FROM `OrganizerRequest` WHERE `OrganizerRequestID` = '%s';", mysql_real_escape_string($organizerRequestID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */
 
function readAllEventTypes() {
	
	$dbQuery = sprintf("SELECT * FROM `EventType`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}


/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function readAllLocations() {
	
	$dbQuery = sprintf("SELECT * FROM `Location`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}
  
 
 ?>
