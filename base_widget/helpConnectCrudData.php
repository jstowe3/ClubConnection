<?php

include 'db_helper.php';


/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createUser($userID, $firstName, $lastName, $email, $phone, $latitude, $longitude) {
	
	$dbQuery = sprintf("INSERT INTO `HelpConnectUser` (`UserID`, `FirstName`, `LastName`, `Email`, `Phone`, `Latitude`, `Longitude`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s');", 
		mysql_real_escape_string($userID),
		mysql_real_escape_string($firstName), 
		mysql_real_escape_string($lastName), 
		mysql_real_escape_string($email), 
		mysql_real_escape_string($phone), 
		mysql_real_escape_string($latitude), 
		mysql_real_escape_string($longitude));

	$result = getDBResultInserted($dbQuery, 'UserID');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readUser($userID) {

	$dbQuery = sprintf("SELECT * FROM `HelpConnectUser` WHERE `UserID`='%s';", mysql_real_escape_string($userID));

	$result=getDBResultRecord($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllUsers() {
	
	$dbQuery = sprintf("SELECT * FROM `HelpConnectUser`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}


function updateUser($userID, $firstName, $lastName, $email, $phone, $latitude, $longitude) {

	$dbQuery = sprintf("UPDATE `HelpConnectUser` SET `FirstName`='%s',`LastName`='%s',`Email`='%s',`Phone`='%s',`Latitude`='%s',`Longitude`='%s' WHERE `UserID`='%s';", 
		mysql_real_escape_string($firstName), 
		mysql_real_escape_string($lastName), 
		mysql_real_escape_string($email), 
		mysql_real_escape_string($phone), 
		mysql_real_escape_string($latitude), 
		mysql_real_escape_string($longitude), 
		mysql_real_escape_string($userID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

function deleteUser($userID) {

	$dbQuery = sprintf("DELETE FROM `HelpConnectUser` WHERE `UserID` = '%s';", mysql_real_escape_string($userID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */
	
function createService($userID, $description, $cost) {
	
	$dbQuery = sprintf("INSERT INTO `HelpConnectService` (`UserID`, `Description`, `Cost`) VALUES ('%s', '%s', '%s');", 
		mysql_real_escape_string($userID),
		mysql_real_escape_string($description),
		mysql_real_escape_string($cost));

	$result = getDBResultInserted($dbQuery, 'ServiceID');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readService($serviceID) {

	$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `ServiceID`='%s';", mysql_real_escape_string($serviceID));

	$result=getDBResultRecord($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllServices($readAllType) {
	
	$splitInfo = explode("*&*", $readAllType);
	/*
	if($readAllType == "user") {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `UserID`='%s';", mysql_real_escape_string($searchItem));
	}
	elseif($readAllType == "description") {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `Description` LIKE '%%s%';", mysql_real_escape_string($searchItem));
	}
	elseif($readAllType == "service") {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `ServiceID`='%s';", mysql_real_escape_string($searchItem));
	}
	else {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService`;");
	}
	*/
	if($splitInfo[0] == "user") {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `UserID`='%s';", mysql_real_escape_string($splitInfo[1]));
		$result = getDBResultsArray($dbQuery);
	}
	elseif($splitInfo[0] == "description") {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `Description` = '%s';", mysql_real_escape_string($splitInfo[1]));
		$result = getDBResultsArray($dbQuery);
	}
	elseif($splitInfo[0] == "service") {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService` WHERE `ServiceID`='%s';", mysql_real_escape_string($splitInfo[1]));
		$result=getDBResultRecord($dbQuery);
	}
	else {
		$dbQuery = sprintf("SELECT * FROM `HelpConnectService`;");
		$result = getDBResultsArray($dbQuery);
	}

	
	header("Content-type: application/json");
	echo json_encode($result);
}


function updateService($serviceID, $description, $cost) {

	$dbQuery = sprintf("UPDATE `HelpConnectService` SET `Description`='%s',`Cost`='%s' WHERE `ServiceID`='%s';", 
		mysql_real_escape_string($description), 
		mysql_real_escape_string($cost), 
		mysql_real_escape_string($serviceID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

function deleteService($serviceID) {

	$dbQuery = sprintf("DELETE FROM `HelpConnectService` WHERE `ServiceID` = '%s';", mysql_real_escape_string($serviceID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */
	
function createServiceStatus($serviceID, $serviceOwnerID, $requesterUserID) {
	
	$dbQuery = sprintf("INSERT INTO `HelpConnectServiceStatus` (`ServiceID`, `ServiceOwnerID`, `RequesterUserID`) VALUES ('%s', '%s', '%s');", 
		mysql_real_escape_string($serviceID),
		mysql_real_escape_string($serviceOwnerID),
		mysql_real_escape_string($requesterUserID));

	$result = getDBResultInserted($dbQuery, 'ServiceStaID');

	header("Content-type: application/json");
	echo json_encode($result);
}

function readServiceStatus($serviceStatusID) {

	$dbQuery = sprintf("SELECT * FROM `HelpConnectServiceStatus` WHERE `ServiceStatusID`='%s';", mysql_real_escape_string($serviceStatusID));

	$result=getDBResultRecord($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function readAllServiceStatuses() {
	
	$dbQuery = sprintf("SELECT * FROM `HelpConnectServiceStatus`;");

	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}


function updateServiceStatus($serviceStatusID, $isConnected, $isPaid) {

	$dbQuery = sprintf("UPDATE `HelpConnectServiceStatus` SET `IsConnected`='%s',`IsPaid`='%s' WHERE `ServiceStatusID`='%s';", 
		mysql_real_escape_string($isConnected), 
		mysql_real_escape_string($isPaid), 
		mysql_real_escape_string($serviceStatusID));

	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

function deleteServiceStatus($serviceStatusID) {

	$dbQuery = sprintf("DELETE FROM `HelpConnectServiceStatus` WHERE `ServiceStatusID` = '%s';", mysql_real_escape_string($serviceStatusID));
	$result = getDBResultAffected($dbQuery);

	header("Content-type: application/json");
	echo json_encode($result);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

 

	
?>