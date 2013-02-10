var users = [];
var events = [];
var groups = [];
var userToGroups = [];
var organizerRequests = [];
var locations = [];
var eventTypes = [];
var emails = [];

var gtPlaces = [];

var currentUserToGroups = [];

var currentUserName = "";
var currentUserID = -1;

var currentGroupID = -1;

var currentEventID = -1;

var currentBldName = "N/A";

$(document).ready(function() {
	readAllUsers();
	authenticateUser();
	readAllEvents();
	readAllGroups();
	readAllUserToGroups();
	readAllEventTypes();

	setTimeout(function() {
		populateUserGroupsList();
		populateUserEventsList();
	}, 200);

	$('.content_div').hide();
	$('#groups').show();
	
	$(document).delegate('[data-role="navbar"] a', 'click', function() {
		// $(this).addClass('ui-btn-active');
		$('.content_div').hide();
		$('#' + $(this).attr('data-href')).show();
		return true;
		//stop default behavior of link
	});

});

function authenticateUser() {
	$.ajax({
		url : "api/authenticateTask",
		context : document.body,
		async : false,
		success : function(data) {
			//get the current username
			currentUserName = jQuery.parseJSON(data);
		}
	});
	//find the correct current userID
	var idFound = false;
	var userGroupsToAdd = [];
	var a = 0;
	while (a < users.length && idFound == false) {
		if (currentUserName == users[a].GTusername) {

			currentUserID = users[a].UserID;
			idFound = true;
		}
		a++;
	}
	// If we didn't find their username, take them to the registration page.
	if (!idFound) {
		$.mobile.changePage($('#register_new_user'));
	}
}

function printData() {
	console.log("Current Username: " + currentUserName);
	console.log("Users Length: " + users.length);
	console.log("Events Length: " + events.length);
	console.log("Group Length: " + groups.length);
	console.log("User To Groups Length: " + userToGroups.length);
	console.log("Locations Length: " + locations.length);
	console.log("Event Types Length: " + eventTypes.length);
}

function populateUserGroupsList() {
	//get the group list and store it in the groupListView variable
	var groupListView = document.getElementById('userGroupsList');
	currentUserToGroups = [];
	var userGroups = [];
	//Now add each group to the list
	for ( i = 0; i < groups.length; i++) {

		var groupID = groups[i].GroupID;
		var safeToAdd = false;

		//Find if the group is safe to add, by searching the userToGroup pairs
		//If the current user's ID is in the pair with the group's ID, then add the group
		var x = 0;
		var found = false;
		while (x < userToGroups.length && found == false) {
			if (currentUserID == userToGroups[x].UserID && groupID == userToGroups[x].GroupID) {
				safeToAdd = true;
				idFound = true;
				currentUserToGroups.push(userToGroups[x]);
			}
			x++;
		}

		//If safeToAdd(The user is subscribed to the group), then add the group
		if (safeToAdd == true) {
			userGroups.push(groups[i]);
		} //end if
	}

	var userGroupList = $("#userGroupList");
	userGroupList.empty();
	if (userGroups.length > 0) {
		$("#userGroupListItem").tmpl(userGroups).appendTo(userGroupList);
	}
	userGroupList.listview("refresh");
}

function populateUserEventsList() {

	var userEvents = [];
	//Now add each group to the list
	for ( i = 0; i < currentUserToGroups.length; i++) {

		var groupID = currentUserToGroups[i].GroupID;

		for ( j = 0; j < events.length; j++) {
			if (events[j].GroupID == groupID) {
				userEvents.push(events[j]);
			}
		}
	}

	var eventListView = $("#userEventList");
	eventListView.empty();
	if (userEvents.length > 0) {
		$("#userEventListItem").tmpl(userEvents).appendTo(eventListView);
	}
	eventListView.listview("refresh");
}

function groupPageButtonDisplay() {
	var createEventBtn = document.getElementById('createEventBtn');
	createEventBtn.style.visibility = "hidden";
	var manageGroupBtn = document.getElementById('manageGroupBtn');
	manageGroupBtn.style.visibility = "hidden";
	var subscribeGroupBtn = document.getElementById('subscribeGroupBtn');
	subscribeGroupBtn.style.visibility = "hidden";
	var unsubscribeGroupBtn = document.getElementById('unsubscribeGroupBtn');
	unsubscribeGroupBtn.style.visibility = "hidden";

	var x = 0;
	var found = false;
	while (x < userToGroups.length && found == false) {
		if (currentUserID == userToGroups[x].UserID && currentGroupID == userToGroups[x].GroupID) {
			found = true;
		}
		x++;
	}

	x--;

	if (found == true) {
		//If user is admin, show manage group button
		//If user is not admin, show unsubscribe button

		if (userToGroups[x].GroupAdmin == "1") {
			createEventBtn.style.visibility = "visible";
			manageGroupBtn.style.visibility = "visible";
		} else {
			unsubscribeGroupBtn.style.visibility = "visible";
		}
	} else {
		//Show subscribe button
		console.log("Not found");
		subscribeGroupBtn.style.visibility = "visible";
	}
}

function eventPageButtonDisplay() {

	var manageEventBtn = document.getElementById('manageEventBtn');
	manageEventBtn.style.visibility = "hidden";

	var x = 0;
	var found = false;
	while (x < currentUserToGroups.length && found == false) {
		console.log("current group id: " + currentGroupID);
		console.log("matching id: " + currentUserToGroups[x].GroupID);
		if (currentGroupID == currentUserToGroups[x].GroupID) {

			if (currentUserToGroups[x].GroupAdmin == "1") {
				manageEventBtn.style.visibility = "visible";
			}
			found = true;
		}
		x++;
	}

}

function subscribe() {
	createUserToGroupSubsciber();
	readAllUserToGroups();
	populateUserGroupsList();
	populateUserEventsList();
	groupPageButtonDisplay();
}

function unsubscribe() {
	var userGroupID = -1;
	var x = 0;
	var found = false;
	while (x < userToGroups.length && found == false) {
		if (currentUserID == userToGroups[x].UserID && currentGroupID == userToGroups[x].GroupID) {
			userGroupID = userToGroups[x].UserGroupID;
			found = true;
		}
		x++;
	}

	deleteUserToGroup(userGroupID);
	readAllUserToGroups();
	populateUserGroupsList();
	populateUserEventsList();
	groupPageButtonDisplay();
}

function populateGroupListEventsOnGroupPage() {
	var groupEvents = [];
	//Now add each group to the list
	for ( i = 0; i < events.length; i++) {

		var groupID = events[i].GroupID;

		//If the group ids match, then add the event
		if (currentGroupID == groupID) {
			groupEvents.push(events[i]);
		} //end if
	}

	var groupEventsList = $("#groupEventsList");
	groupEventsList.empty();
	if (groupEvents.length > 0) {
		$("#eventListItem").tmpl(groupEvents).appendTo(groupEventsList);
	}
	$('#groupDetails').bind('pageinit', function() {
		groupEventsList.listview("refresh");
	});

}

/*
 * ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 * ----------------------DATA AQUISITION FUNCTIONS-----------------------------
 * ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 */

function eventCreate() {
	var title = document.getElementById('event-name-input').value;
	var description = document.getElementById('event-description-input').value;
	var startTime = document.getElementById('event-startTime-input').value;
	//startTime.format("yyyy-mm-dd hh:MM:ss");
	var endTime = document.getElementById('event-endTime-input').value;
	//startTime.format("yyyy-mm-dd hh:MM:ss");
	var locationName = document.getElementById('event-location-input').value + "+" + document.getElementById('room-description-input').value;
	var locationID = 2;
	var eventTypeID = 2;
	var lastModified = new Date().toString();

	$.ajax({
		url : "api/eventTask/event",
		data : {
			'groupID' : currentGroupID,
			'title' : title,
			'description' : description,
			'startTime' : startTime,
			'endTime' : endTime,
			'locationName' : locationName,
			'locationID' : null,
			'eventTypeID' : null,
			'lastModified' : lastModified
		},
		context : document.body,
		type : 'POST',
		success : function(data) {
			$('#PostResult').html(data);
			readAllEvents();
			populateGroupListEventsOnGroupPage();
			populateUserEventsList();
		}
	});

}

function readEvent(eventID) {

	currentEventID = eventID;

	var currentEvent = null;

	$.ajax({
		url : "api/eventTask/" + eventID,
		context : document.body,
		async : false,
		success : function(data) {
			currentEvent = jQuery.parseJSON(data);

			$("#event-title").text(currentEvent.Title);
			$("#event-description").text(currentEvent.Description);

			currentGroupID = currentEvent.GroupID;
			//Go find the matching group Email and Name using groupID of event
			var hostEmail = null;
			var hostName = null;
			for (var i = 0; i < groups.length; i++) {
				if (groups[i].GroupID == currentEvent.GroupID) {
					hostEmail = groups[i].Email;
					hostName = groups[i].Name;
				}
			}
			$("#event-group-email").text(hostEmail);
			$("#event-group-email").attr('href', 'mailto:' + hostEmail);
			$("#event-host-group").text(hostName);

			locationArray = currentEvent.LocationName.split("+");
			var buildingName = "";
			buildingName = locationArray[0];
			var roomNo = "";
			if (locationArray.length > 1) {
				roomNo = locationArray[1];
			}

			$("#event-location").text(buildingName);
			$("#event-location-room").text(roomNo);
			$("#event-start-time").text(currentEvent.StartTime);
			$("#event-end-time").text(currentEvent.EndTime);

			//Pre-populate values on manageEvent page:
			$("#event-name-input-edit").val(currentEvent.Title);
			$("#event-location-input-edit").val(buildingName);
			$("#room-description-input-edit").val(roomNo);
			$("#event-startTime-input-edit").val(currentEvent.StartTime);
			$("#event-endTime-input-edit").val(currentEvent.EndTime);
			$("#event-description-input-edit").val(currentEvent.Description);

			// Set our global variable
			currentBldName = buildingName;
			console.log("SETTING CURRENT BLDNAME TO: " + currentBldName);
			console.log("Building Name Was: " + buildingName);

			$("#toEventPage").attr('onclick', "readGroup(currentGroupID);");

			eventPageButtonDisplay();

			$.mobile.changePage($('#eventDetails'));
		}
	});
}

function readAllEvents() {
	$.ajax({
		url : "api/eventTask",
		context : document.body,
		async : false,
		success : function(data) {
			events = jQuery.parseJSON(data);

			var allEventList = $("#allEventList");
			allEventList.empty();
			$("#eventListItem").tmpl(events).appendTo(allEventList);
			allEventList.listview("refresh");

		}
	});
}

function updateEvent() {

	var eventID = currentEventID;
	var title = document.getElementById('event-name-input-edit').value;
	var description = document.getElementById('event-description-input-edit').value;
	var startTime = document.getElementById('event-startTime-input-edit').value;
	var endTime = document.getElementById('event-endTime-input-edit').value;
	var locationName = document.getElementById('event-location-input-edit').value + "+" + document.getElementById('room-description-input-edit').value;
	var locationID = null;
	var eventTypeID = null;
	var lastModified = null;

	$.ajax({
		url : "api/eventTask/" + eventID,
		context : document.body,
		data : {
			'eventID' : eventID,
			'title' : title,
			'description' : description,
			'startTime' : startTime,
			'endTime' : endTime,
			'locationName' : locationName,
			'locationID' : null,
			'eventTypeID' : null
		},
		headers : {
			'X-HTTP-Method-Override' : 'PUT'
		},
		type : 'POST',
		success : function(data) {
			$('#PutResult').html(data);
			readAllEvents();
			populateGroupListEventsOnGroupPage();
			populateUserEventsList();
			readEvent(eventID);
		}
	});
}

function deleteEvent() {

	var eventID = currentEventID;

	$.ajax({
		url : "api/eventTask/" + eventID,
		context : document.body,
		type : 'DELETE',
		success : function(data) {
			$('#DeleteResult').html(data);
			readAllEvents();
			populateGroupListEventsOnGroupPage();
			populateUserEventsList();
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createUser() {

	var firstName = document.getElementById('first-name');
	var lastName = document.getElementById('last-name');
	var email = document.getElementById('email');

	$.ajax({
		url : "api/userTask/user",
		data : {
			'GTusername' : currentUserName,
			'firstName' : firstName.value,
			'lastName' : lastName.value,
			'email' : email.value
		},
		context : document.body,
		type : 'POST',
		success : function(data) {
			$('#PostResult').html(data);
			readAllUsers();
			authenticateUser();
		}
	});

}

function readUser() {
	var userID = "1";

	$.ajax({
		url : "api/userTask/" + userID,
		context : document.body,
		async : false,
		success : function(data) {
			$('#IndexResult').html(data);
		}
	});
}

function readAllUsers() {
	$.ajax({
		url : "api/userTask",
		context : document.body,
		async : false,
		success : function(data) {
			users = jQuery.parseJSON(data);
		}
	});
}

function updateUser() {

	
	var GTusername = "pjones35 UPDATED";
	var firstName = "Perron UPDATED";
	var lastName = "Jones UPDATED";
	var email = "cool email UPDATED";

	$.ajax({
		url : "api/userTask/" + userID,
		context : document.body,
		data : {
			'userID' : currentUserID,
			'GTusername' : GTusername,
			'firstName' : firstName,
			'lastName' : lastName,
			'email' : email
		},
		headers : {
			'X-HTTP-Method-Override' : 'PUT'
		},
		type : 'POST',
		success : function(data) {
			$('#PutResult').html(data);
			readAllUsers();
			authenticateUser();
		}
	});
}

function deleteUser() {

	var userID = "6";

	$.ajax({
		url : "api/userTask/" + userID,
		context : document.body,
		type : 'DELETE',
		success : function(data) {
			$('#DeleteResult').html(data);
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createUserToGroup(newGroupID) {
	$.ajax({
		url : "api/userToGroupTask/userToGroup",
		data : {
			'userID' : currentUserID,
			'groupID' : newGroupID,
			'groupAdmin' : "1"
		},
		context : document.body,
		async : false,
		type : 'POST',
		success : function(data) {
			$('#PostResult').html(data);
			readAllUserToGroups();
		}
	});
}

function createUserToGroupSubsciber() {
	$.ajax({
		url : "api/userToGroupTask/userToGroup",
		data : {
			'userID' : currentUserID,
			'groupID' : currentGroupID,
			'groupAdmin' : "0"
		},
		context : document.body,
		async : false,
		type : 'POST',
		success : function(data) {
			$('#PostResult').html(data);
			readAllUserToGroups();
		}
	});
}

function readUserToGroup() {
	var userID = "3";

	$.ajax({
		url : "api/userToGroupTask/" + userID,
		context : document.body,
		async : false,
		success : function(data) {
			$('#IndexResult').html(data);
		}
	});
}

function readAllUserToGroups() {
	$.ajax({
		url : "api/userToGroupTask",
		context : document.body,
		async : false,
		success : function(data) {
			userToGroups = jQuery.parseJSON(data);
		}
	});
}

function updateUserToGroup() {

	var userGroupID = "3";
	var groupAdmin = "1";

	$.ajax({
		url : "api/userToGroupTask/" + userGroupID,
		context : document.body,
		data : {
			'userGroupID' : userGroupID,
			'groupAdmin' : groupAdmin
		},
		headers : {
			'X-HTTP-Method-Override' : 'PUT'
		},
		type : 'POST',
		success : function(data) {
			$('#PutResult').html(data);
		}
	});
}

function deleteUserToGroup(userGroupID) {

	$.ajax({
		url : "api/userToGroupTask/" + userGroupID,
		context : document.body,
		type : 'DELETE',
		success : function(data) {
			$('#DeleteResult').html(data);
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createGroup() {

	var name = document.getElementById('group-name-input').value;
	var description = document.getElementById('group-description-input').value;
	var email = document.getElementById('group-email-input').value;

	$.ajax({
		url : "api/groupTask/group",
		data : {
			'name' : name,
			'description' : description,
			'email' : email
		},
		context : document.body,
		async : false,
		type : 'POST',
		success : function(data) {
			$('#PostResult').html(data);
			console.log("Data from create group: " + data);
			var newGroupID = jQuery.parseJSON(data).GroupId;
			console.log("New group ID: " + newGroupID);

			createUserToGroup(newGroupID);
			readAllGroups();
			populateUserGroupsList();

		}
	});
}

function readGroup(groupID) {
	currentGroupID = groupID;

	$.ajax({
		url : "api/groupTask/" + groupID,
		context : document.body,
		async : false,
		success : function(data) {
			group = jQuery.parseJSON(data);

			//var n = group.Name;

			$("#group-name").text(group.Name);
			$("#group-description").text(group.Description);
			$("#group-email").text(group.Email);
			$("#group-email").attr('href', 'mailto:' + group.Email);

			//These next 3 lines will populate the edit fields in the manage group page
			$("#group-name-input-edit").val(group.Name);
			$("#group-description-input-edit").text(group.Description);
			$("#group-email-input-edit").val(group.Email);

			groupPageButtonDisplay();
			populateGroupListEventsOnGroupPage();
			readEmailsFrom(group.Email);

			$.mobile.changePage($('#groupDetails'));
			
			$(document).bind('pagechange', function() {
  $('.ui-page-active .ui-listview').listview('refresh');
  $('.ui-page-active :jqmData(role=content)').trigger('create');
});
			
		}
	});
}

function readAllGroups() {
	$.ajax({
		url : "api/groupTask",
		context : document.body,
		async : false,
		success : function(data) {
			groups = jQuery.parseJSON(data);
			var allGroupList = $("#allGroupList");
			allGroupList.empty();
			$("#groupListItem").tmpl(groups).appendTo(allGroupList);
			allGroupList.listview("refresh");
		}
	});
}

function updateGroup() {
	var name = document.getElementById('group-name-input-edit').value;
	var description = document.getElementById('group-description-input-edit').value;
	var email = document.getElementById('group-email-input-edit').value;

	$.ajax({
		url : "api/groupTask/" + currentGroupID,
		context : document.body,
		data : {
			'GroupID' : currentGroupID,
			'name' : name,
			'description' : description,
			'email' : email
		},
		headers : {
			'X-HTTP-Method-Override' : 'PUT'
		},
		type : 'POST',
		success : function(data) {
			$('#PutResult').html(data);
			readAllGroups();
			populateUserGroupsList();
			readGroup(currentGroupID);
		}
	});
}

function deleteGroup() {

	$.ajax({
		url : "api/groupTask/" + currentGroupID,
		context : document.body,
		type : 'DELETE',
		success : function(data) {
			$('#DeleteResult').html(data);
			readAllGroups();
			populateUserGroupsList();
			readGroup(currentGroupID);
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function createOrganizerRequest() {
	var userID = "3";
	var groupID = "9";

	$.ajax({
		url : "api/OrganizerRequestTask/organizerRequest",
		data : {
			'userID' : userID,
			'groupID' : groupID
		},
		context : document.body,
		type : 'POST',
		success : function(data) {
			$('#PostResult').html(data);
		}
	});
}

function readOrganizerRequest() {
	var groupID = "9";

	$.ajax({
		url : "api/OrganizerRequestTask/" + groupID,
		context : document.body,
		async : false,
		success : function(data) {
			organizerRequests = jQuery.parseJSON(data);
		}
	});
}

function readAllOrganizerRequests() {
	$.ajax({
		url : "api/OrganizerRequestTask",
		context : document.body,
		async : false,
		success : function(data) {
			organizerRequests = jQuery.parseJSON(data);
		}
	});
}

function deleteOrganizerRequest() {

	var organizerRequestID = "1";

	$.ajax({
		url : "api/OrganizerRequestTask/" + organizerRequestID,
		context : document.body,
		type : 'DELETE',
		success : function(data) {
			$('#DeleteResult').html(data);
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function readAllEventTypes() {
	$.ajax({
		url : "api/EventTypeTask",
		context : document.body,
		async : false,
		success : function(data) {
			eventTypes = jQuery.parseJSON(data);
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function readAllLocations() {
	$.ajax({
		url : "api/LocationTask",
		context : document.body,
		async : false,
		success : function(data) {
			locations = jQuery.parseJSON(data);
		}
	});
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function readAllEmails() {
	$.ajax({
		url : "api/emailTask",
		context : document.body,
		async : false,
		success : function(data) {
			emails = jQuery.parseJSON(data);
			//console.log("EMAIL HERE: " + jQuery.parseJSON(data));
		}
	});
}

function readEmailsFrom(senderEmail) {

	$.ajax({
		url : "api/emailTask/" + senderEmail,
		context : document.body,
		data : {
			'senderEmail' : senderEmail
		},
		async : false,
		success : function(data) {
			emails = jQuery.parseJSON(data);

			var emailList = $("#groupEmailList");
			emailList.empty();

			var jsonEmail = [];
			if (emails != null) {
				var i = 0;
				for ( i = 0; i < emails.length - 1; i += 2) {
					console.log("EMAIL SUBJECT FOR uid: " + emails[i][0].uid + ": " + emails[i][0].subject);
					console.log("EMAIL BODY FOR uid: " + emails[i][0].uid + ": " + emails[i + 1]);
					jsonEmail.push({
						"uid" : emails[i][0].uid,
						"subject" : emails[i][0].subject,
						"date" : emails[i][0].date,
						"body" : emails[i + 1]
					});
				}
			}
			//Update our global variable for the JSON format objects
			emails = jsonEmail;
			if (jsonEmail.length > 0) {
				$("#emailGroupListItem").tmpl(jsonEmail).appendTo(emailList);
			}
			$('#groupDetails').bind('pageinit', function() {
				emailList.listview("refresh");
			});

		}
	});
}

function viewEmail(uid) {
	var targetEmail = null;
	var i = 0;
	for ( i = 0; i < emails.length; i++) {
		if (emails[i].uid == uid) {
			targetEmail = emails[i];
		}
	}
	console.log("CALLING viewEmail w/ uid: " + uid);
	console.log("SETTING SUBJECT TO: " + targetEmail.subject);
	console.log("SETTING DATE TO: " + targetEmail.date);
	console.log("SETTING BODY TO: " + targetEmail.body);
	$("#email_header").text(targetEmail.subject);
	$("#email-message-content").text(targetEmail.date + "\n\n" + targetEmail.body);
	$("#email-message-content").attr('disabled', true);
}

/*
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

function readAllGTplaces() {
	var places = [];
	gtPlaces = [];
	$.ajax({
		url : "/widget/gtplaces/content/api/buildings",
		context : document.body,
		async : false,
		success : function(data) {
			places = jQuery.parseJSON(data);

			var GTplacesList = $("#event-location-input");
			GTplacesList.empty();
			$("#eventLocationOptionItem").tmpl(places).appendTo(GTplacesList);

			for ( i = 0; i < places.length; i++) {
				gtPlaces.push(places[i].name);
			}

			//$( "#event-location-input" ).autocomplete({
			//source: gtPlaces
			//});

			$("#event-location-input").autocomplete({
				target : $('#suggestions'),
				source : gtPlaces,
				//link: 'target.html?term=',
				callback : function fn(e) {
					var $a = $(e.currentTarget);
					// access the selected item
					$('#event-location-input').val($a.text());
					// place the value of the selection into the search box
					$("#event-location-input").autocomplete('clear'); // clear the listview
				}, // optional callback function fires upon result selection
				minLength : 1,
				matchFromStart : false
			});

			//var GTplacesList2 = $("#event-location-input-edit");
			//GTplacesList2.empty();
			//$("#eventLocationOptionItem-edit").tmpl(places).appendTo(GTplacesList2);
			
			$("#event-location-input-edit").autocomplete({
				target : $('#suggestions-edit'),
				source : gtPlaces,
				//link: 'target.html?term=',
				callback : function fn(e) {
					var $a = $(e.currentTarget);
					// access the selected item
					$('#event-location-input-edit').val($a.text());
					// place the value of the selection into the search box
					$("#event-location-input-edit").autocomplete('clear'); // clear the listview
				}, // optional callback function fires upon result selection
				minLength : 1,
				matchFromStart : false
			});

		}
	});
	$("#event-location-input-edit").val(currentBldName);
	console.log("Setting the value of DROPDOWN to: " + currentBldName);
}

function readGTplace() {

}