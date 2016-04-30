/* headersCtrl: controls the information displayed in the headers (the courseName
and usernam). Also controls the sign out functionality
*/
app.controller('headersCtrl', function($scope, $http, userInfo)
{

    $scope.loggedIn = false;

    /*Function: handleClick
      Description:Emits to the broadcast the given message, loggedIn status,
      and coursename. Used in this controller to emit when the user loggs
      out, to notify the other ctrls to update their views.
    */
    $scope.handleClick = function(msg, log, course) {
          $scope.$emit('handleEmit', {message: msg, loggedIn: log, coursename: course});
    };

    /*Function: on(handleBroadcast)
      Description: Handles the broadcast to update header information.
    */
    $scope.$on('handleBroadcast', function(event, args) {

        //sets username when user loggs in
        if(args.loggedIn && args.message != "" && args.message != null)
        {
          $scope.username = args.message;
          $scope.loggedIn = true;
        }

        if(args.message)
           $scope.username = args.message;

        //updates coursename info when user changes course
        if(args.coursename)
        {
           $scope.courseName = args.coursename;
           userInfo.setCurrCourse(args.coursename);
        }
        //unsets username when user loggs out
        if(args.loggedIn == false)
        {
          setDefault();
        }

     });

    /*Function: setDefault
      Description: Resets username and coursename to blank
    */
    function setDefault()
    {
        $scope.username = "";
        $scope.courseName = "";
    }
    setDefault();


     /*Function: signOut
       Description: sets relevent loggedIn info the user signs out. Broadcasts
       this info to other controllers. Also sets the sessionStorage username off.
     */
     $scope.signOut = function()
     {
       if (confirm('Are you sure you want to sign out?')) {
         $scope.loggedIn = false;
         $scope.handleClick("", false, "");
         sessionStorage.setItem('username', "");
       }

     }

//end of controller 
});
