//Train Scheduler

//Add Firebase to Train Scheduler
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHEpEpDRzGrv1pQnhM0BpMOqkHGYxB5xw",
    authDomain: "train-scheduler-ba62f.firebaseapp.com",
    databaseURL: "https://train-scheduler-ba62f.firebaseio.com",
    projectId: "train-scheduler-ba62f",
    storageBucket: "train-scheduler-ba62f.appspot.com",
    messagingSenderId: "472085006636"
};
firebase.initializeApp(config);
//Create a variable to reference the database
var database = firebase.database();

//Initial Values
var name = "";
var destination = "";
var firstTime = 0;
var frequency = "";

//Capture Button Click
$("#formID").on("click", function (event) {
    //Don't refresh the page!
    event.preventDefault();
    
    //Logic for storing and recieving new train times.
    name = $("#trainName").val().trim();
    destination = $("#trainDestination").val().trim();
    firstTime = $("#firstTrainTime").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().set({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });

    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");

    return false;
});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("value", function(snapshot) {

    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().trainDestination);
    console.log(snapshot.val().firstTrainTime);
    console.log(snapshot.val().frequency);

    // Change the HTML to reflect
    $("#trainName").text(snapshot.val().trainName);
    $("#trainDestination").text(snapshot.val().trainDestination);
    $("#firstTrainTime").text(snapshot.val().firstTrainTime);
    $("#frequency").text(snapshot.val().frequency);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


  //STOP
  //Other Stuff...
database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

    var updateButton = $("<button>").html("<span class='glyphicon glyphicon-edit'></span>").addClass("updateButton").attr("data-index", index).attr("data-key", childSnapshot.key);
    var removeButton = $("<button>").html("<span class='glyphicon glyphicon-remove'></span>").addClass("removeButton").attr("data-index", index).attr("data-key", childSnapshot.key);

    var firstTime = childSnapshot.val().firstTime;
    var tFrequency = parseInt(childSnapshot.val().frequency);
    var firstTrain = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTrain);
    console.log(firstTime);
    //var currentTime = moment();
    //var currentTimeCalc = moment().subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrain), "minutes");
    var tRemainder = diffTime % tFrequency;
    var minutesRemaining = tFrequency - tRemainder;
    //var nextTRain = moment().add(minutesRemaining, "minutes").format("hh:mm A");
    //var beforeCalc = moment(firstTrain).diff(currentTimeCalc, "minutes");
    //var beforeMinutes = Math.ceil(moment.duration(beforeCalc).asMinutes());

    /*if ((currentTimeCalc - firstTrain) < 0) {
        nextTrain = childSnapshot.val().firstTime;
        console.log("Before First Train");
        minutesRemaining = beforeMinutes;
    }
    else {
        nextTrain = moment().add(minutesRemaining, "minutes").format("hh:mm A");
        minutesRemaining = tFrequency - tRemainder;
        console.log("Working");
    }*/


    var newRow = $("<tr>");
    newRow.addClass("row-" + index);
    var cell1 = $("<td>").append(updateButton);
    var cell2 = $("<td>").text(childSnapshot.val().name);
    var cell3 = $("<td>").text(childSnapshot.val().destination);
    var cell4 = $("<td>").text(childSnapshot.val().frequency);
    var cell5 = $("<td>").text(nextTrain);
    var cell6 = $("<td>").text(minutesRemaining);
    var cell7 = $("<td>").append(removeButton);

    newRow
        .append(cell1)
        .append(cell2)
        .append(cell3)
        .append(cell4)
        .append(cell5)
        .append(cell6)
        .append(cell7);

    $("#tableContent").append(newRow);

    index++;

}, function (error) {

    alert(error.code);

});

function removeRow() {
    $(".row-" + $(this).attr("data-index")).remove();
    database.ref().child($(this).attr("data-key")).remove();
};

function editRow() {
    $(".row-" + $(this).attr("data-index")).children().eq(1).html("<textarea class='newName'></textarea>");
    $(".row-" + $(this).attr("data-index")).children().eq(2).html("<textarea class='newDestination'></textarea>");
    $(".row-" + $(this).attr("data-index")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
    $(this).toggleClass("updateButton").toggleClass("submitButton");
};

function submitRow() {
    var newName = $(".newName").val().trim();
    var newDestination = $(".newDestination").val().trim();
    var newFrequency = $(".newFrequency").val().trim();

    database.ref().child($(this).attr("data-key")).child("name").set(newName);
    database.ref().child($(this).attr("data-key")).child("destination").set(newDestination);
    database.ref().child($(this).attr("data-key")).child("frequency").set(newFrequency);

    $(".row-" + $(this).attr("data-index")).children().eq(1).html(newName);
    $(".row-" + $(this).attr("data-index")).children().eq(2).html(newDestination);
    $(".row-" + $(this).attr("data-index")).children().eq(3).html(newFrequency);
    $(this).toggleClass("updateButton").toggleClass("submitButton");
};

$(document).on("click", ".removeButton", removeRow);
$(document).on("click", ".updateButton", editRow);
$(document).on("click", ".submitButton", submitRow);