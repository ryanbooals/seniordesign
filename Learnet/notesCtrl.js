app.controller('notesCtrl', function($scope, $http, userInfo)
{
  $scope.$on('handleBroadcast', function(event, args) {

    if(args.coursename)
    {
        getNoteData();
     }
     if(args.loggedIn == false)
     {
       $scope.notes = [];
       $scope.firstNote.fileDest = "";
     }
   });



  function getNoteData()
  {
    var course = userInfo.getCurrCourse();

    var data = {
      "course": course
    }

    $http({
  url: "loadNoteData.php",
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
      $scope.firstNote.fileDest = "";
    }

  });

  }

});
