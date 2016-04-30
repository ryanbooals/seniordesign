app.controller('forumCtrl', function($scope, $http, userInfo)
{
  $scope.courseChosen = false;
  $scope.content = "";
  $scope.numpPosts = 0;

  /* Function: on(handleBroadcast)
     Description: Handles the broadcast. Checks for course change and log In change
  */
  $scope.$on('handleBroadcast', function(event, args) {

    //populates the forum view when user changes course or logs in
    if(args.coursename)
    {
      $scope.courseChosen = true;
      getForumData();
      getComments();
    }
    //clear the view if the user has logged out
    if(args.loggedIn == false)
    {
      $scope.posts = [];
      $scope.courseChosen = false;
      $scope.noForums = false;
     }
   });

   /* Function: getForumData
      Description: Populates the posts array with the forum data from the database
      Sets the noForums variable if there are no forum posts for the course. Reverses
      the returned array from the POST request to show the posts in a 'most recent at
      the top' fashion
   */
  function getForumData()
  {

    var data = {
      "course": userInfo.getCurrCourse()
    }

    $http({
      url: "../php/loadForumData.php",
      method: "POST",
      data: data
    }).success(function(response) {

      $scope.posts = response.records.reverse();

      if($scope.posts.length == 0)
        $scope.noForums = true;
      else
        $scope.noForums = false;

    });

  }

  /* Function: getComments
     Description: Populates the comments array with data from the database
  */
  function getComments()
  {

    var data = {
      "course": userInfo.getCurrCourse()
    }

    $http({
      url: "../php/loadCommentData.php",
      method: "POST",
      data: data
      }).success(function(response) {
        $scope.comments = response.records;
      });
  }

  /* Function: submitComment
     Description: Submits the user's comment to the database then reloads the
     comment data to provide an immediate reponse. Matches the comment content
     to the corresponding post Id.
  */
  function submitComment(postId, content)
  {
    var data = {
      "course": userInfo.getCurrCourse(),
      "postId": postId,
      "author": userInfo.getUN(),
      "content": content
    }

    $http({
      url: "../php/submitComment.php",
      method: "POST",
      data: data
    }).success(function(response) {

    jQuery('.textAr').val(''); // clears input

    alert(response.resp);
    getComments();

  });

  }

  /* Function: addComment
     Description: calls the submitComment function.
 */
 $scope.addComment = function(postId, content)
 {
  submitComment(postId, content);

 }

 /* Function: getPosts
    Description: Loads forum and comment data
 */
 $scope.getPosts = function()
 {
    getForumData();
    getComments();

 }


//end of controller

});
