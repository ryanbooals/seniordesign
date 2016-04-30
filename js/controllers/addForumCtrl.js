/*
addForumCtrl: Handles the functionality for the add Fourm Post modal. Allows the
user to submit a post that contains a title and content. This post also has the metadata
author, course, post time, and id.
*/
app.controller('addForumCtrl', function($scope, $http, userInfo)
{

  $scope.course = "No Course Selected";
  $scope.username = "Not Signed In";
  $scope.title = "";
  $scope.content = "";

  /* Function: on(handleBroadcast)
  Description: Handles the broadcast. It updates the course when the user changes
  their course on the right side of the page
  */
 $scope.$on('handleBroadcast', function(event, args) {

   if(args.coursename)
   {
     $scope.course = args.coursename;
   }

 });

 /* Function: handleClick
 Description: emits the coursename to the broadcast. Used to communicate with
 Forum control to have it update the foru mview once the forum is posted
 */
  $scope.handleClick = function(course) {
       $scope.$emit('handleEmit', {coursename: course});
   };

   /* Function: getCourseandUser
   Description: Sets the course and username scope variables to the result of
   the factory functions for getting user Info
   */
  $scope.getCourseandUser = function()
  {
      $scope.course = userInfo.getCurrCourse();
      $scope.username = userInfo.getUN();
  }

  /* Function: submitPost
  Description: Submits the post by calling the submitForumData funciton
  */
  $scope.submitPost = function()
  {
    sendForumData();
  }

  /* Function: sendForumData
  Description: sends the forum data to the database. Sending the course title,
  user, as well as the title and content of the post. It then clears the title
  and content fields, hides the modal, and updates the forum view via the
  handleclick funcion
  */
  function sendForumData()
  {
    $scope.getCourseandUser();

    var data = {
      "title": $scope.title,
      "author": $scope.username,
      "content": $scope.content,
      "course": $scope.course
    }

      $http({
    url: "../php/submitForumData.php",
    method: "POST",
    data: data
    }).success(function(response) {

      $scope.title = "";
      $scope.content = "";
      jQuery('#forumModal').modal('hide'); // hide modal
      $scope.handleClick(data.course);

    });
  }


});
