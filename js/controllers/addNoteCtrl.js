/*addNoteCtrl.js Most of the functionality for adding a note is handled in the
jQuery, because the file upload is a jQuery Plugin. The only $scope variables
are the title, to ensure the user has entered a title, and the course name, so
the user knows which course they are posting too, and that the upload to the database
has the course information.
*/
app.controller('addNoteCtrl', function($scope, $http) {

	$scope.titleInput = "";

  $scope.$on('handleBroadcast', function(event, args) { //occurs when opening modal
    if(args.coursename)
    {
      $scope.course = args.coursename;
    }
  });

});
