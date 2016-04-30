/* notesCtrl: Controlles for the notes view. Has a loop that checks for a change in
the number of notes in the database, and updates the note data if there is
a new note in the database.
*/
app.controller('notesCtrl', function($scope, $http, userInfo)
{

  $scope.numNotes = 0; //counter for number of notes in the database
  $scope.firstNote = {}; //no Note object, for when the course has no notes

  var checking = false; //flag for when to start checking for new notes

  /*Function: on(handleBroadcast)
    Description: Handles broadcast events. When a course is selected/changed,
    get the note data and begin note checking loop. If the user loggs out,
    clear the scope variables
  */
  $scope.$on('handleBroadcast', function(event, args) {

     if(args.coursename)
     {
        getNoteData();
        if(!checking)
        {
          repeatCheck(); //start Checking notes
          checking = true;
        }
     }
     if(args.loggedIn == false)
     {
       $scope.notes = [];
       $scope.firstNote.fileDest = "";
     }
   });

  /*Function: checkNotes
    Description: This function calls itself every 2 seconds (i think ?). Receives
    an event from the note Update Loop and sets the note counter to the data from
    this event. If the num notes counter is different than the event data, get the
    note data from the database.
  */
  function checkNotes()
  {
    setTimeout(checkNotes, 5000);
    //Checking for number of Notes
    if(typeof(EventSource)!=="undefined") {

      //create an object, passing it the name and location of the server side script
      var eSource = new EventSource("../php/noteUpdateLoop.php");

      //detect message receipt
      eSource.onmessage = function(event) {

       if($scope.numNotes != event.data) // note data is offf
       {
         getNoteData();
       }
        $scope.numNotes = event.data;
      };
      eSource.onerror = function(event) {
     };

    }

  }

  /*Function: repeatCheck
    Description: Begins the checkNotes repeat.
  */
  function repeatCheck()
  {
    checkNotes();
    //console.log("Check: " + checking);
  }

  /*Function: getNoteData
    Description: Begins the checkNotes repeat.
  */
  function getNoteData()
  {
    var course = userInfo.getCurrCourse();

    var data = {
      "course": course
    }

    $http({
      url: "../php/loadNoteData.php",
      method: "POST",
      data: data
    }).success(function(response) {

      $scope.notes = response.records;

      if($scope.notes.length > 0)
      {
        $scope.firstNote = $scope.notes[0];
      }
      else
      {
        $scope.firstNote.fileDest = "uploads/noNote.pdf";
      }

    });

  }

//end of controller
});
