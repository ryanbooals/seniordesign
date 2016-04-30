app.controller('addForumCtrl', function($scope, $http, userInfo)
{
  $scope.course = "No Course Selected";
  $scope.username = "Not Signed In";
 $scope.title = "";
 $scope.content = "";

 $scope.handleClick = function(course) {
       $scope.$emit('handleEmit', {coursename: course});
   };

  $scope.getCourseandUser = function()
  {

      $scope.course = userInfo.getCurrCourse();
        $scope.username = userInfo.getUN();

  }
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
  url: "submitForumData.php",
  method: "POST",
  data: data
  }).success(function(response) {

    //alert(response.resp);
    $scope.title = "";
    $scope.content = "";
    jQuery('#forumModal').modal('hide'); // hide modal
    $scope.handleClick(data.course);

  });
  }

  $scope.submitPost = function()
  {
    sendForumData();
  }


});
