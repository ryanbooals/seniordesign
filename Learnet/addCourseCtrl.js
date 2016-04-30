//angular script
var app = angular.module('myApp', []);

//Run for broadcasting Events between controllers
app.run(function($rootScope)
{
  $rootScope.$on('handleEmit', function(event,args)
  {
    $rootScope.$broadcast('handleBroadcast', args);
  });

});

//Factory for accessing/changing user info
app.factory('userInfo' , function($http)
{
var data = {
  username: '',
  loggedIn: false,
  currentCourse: '',
  courses:{}
};

return {
  getUN: function()
  {
    return data.username;
  },
  setUN: function(shit)
  {
    data.username = shit;
  },
  getLog: function()
  {
    return data.loggedIn;
  },
  setLog: function(shit)
  {
    data.loggedIn = shit;
  },
  getCurrCourse: function()
  {
    return data.currentCourse;
  },
  setCurrCourse: function(shit)
  {
    data.currentCourse = shit;
  },
  getCourses: function()
  {
    $http({
  url: "testDB.php",
  method: "POST",
  data: data.username
    }).success(function(response) {
      //set courses to return matching courses

    });
  }

};
});

app.controller('addNoteCtrl', function($scope, $http) {

	$scope.titleInput = "";

});




app.controller('forumCtrl', function($scope, $http, userInfo)
{
  $scope.courseChosen = false;

  $scope.$on('handleBroadcast', function(event, args) {

    if(args.coursename)
    {
      $scope.courseChosen = true;
        getForumData();
     }
     if(args.loggedIn == false)
     {
       $scope.posts = [];
         $scope.courseChosen = false;
     }
   });

  function getForumData()
  {
    var course = userInfo.getCurrCourse();

    var data = {
      "course": course
    }

    $http({
  url: "loadForumData.php",
  method: "POST",
  data: data
  }).success(function(response) {

    $scope.posts = response.records;
  });


  }

  $scope.getPosts = function()
  {
    getForumData();

  }




});



app.controller('headersCtrl', function($scope, $http, userInfo)
{

    function setDefault()
    {
        $scope.username = "Sign in to Contribute!";
        $scope.courseName = "";
    }
    setDefault();

    $scope.$on('handleBroadcast', function(event, args) {

      if(args.message)
         $scope.username = args.message;

      if(args.coursename)
      {
         $scope.courseName = args.coursename;
         userInfo.setCurrCourse(args.coursename);


       }
       if(args.loggedIn == false)
       {
        setDefault();
       }

     });



});

app.controller('rightContentCtrl', function($scope, $http, userInfo) {


  $scope.$on('handleBroadcast', function(event, args) {
       if(args.loggedIn && args.message != "" && args.message != null)
       {
         $scope.un = args.message;
         $scope.loggedIn = true;
         loadCourses();
       }

   });
   $scope.handleClick = function(msg, log, course) {
         $scope.$emit('handleEmit', {message: msg, loggedIn: log, coursename: course});
     };


  $scope.loggedIn = false;
  $scope.courseInput = "";
  $scope.hits =[];
  $scope.isLogged = false;
  $scope.selectedCourses = [];
  $scope.ERROR = "None";
  var availableTags = [];
  var a2 = [];

  function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
  }

  $http.get("results.json")
    .success(function (response)
    {
            $scope.courses = response.records;

            for(var i = 0; i < response.records.length; i++)
            {
              availableTags.push( response.records[i].courseString);

            }
            a2 = availableTags.filter(onlyUnique);

    });

    $scope.changeCourse = function(courseName)
    {
      //alert(courseName);
      $scope.handleClick("", true, courseName);
    }

    $scope.removeCourse = function(name)
    {
      var index = $scope.selectedCourses.indexOf(name)
      $scope.selectedCourses.splice(index, 1);
      removeCourse(name);
    }

    $scope.addCourse = function()
    {
      var i;
      for (i = 0; i < a2.length; i++)
      {
        if($scope.courseInput == a2[i])
        {
          $scope.ERROR = "Matched";
          break;
        }

      }
      if (i < a2.length) // is valid input
      {
        $scope.selectedCourses.push($scope.courseInput);
        $scope.submitCourses();
        $scope.courseInput = "";
      }
      else //invalid input
      {
        $scope.ERROR = "BAD INPUT" + i;
      }
    }


    $scope.eCamp = function()
    {

      $scope.hits = [];
      $scope.matches = [];
      //$scope.selectedCourses = [];
      var match;
      var regExp = /\((.*?)\)/g;
      //$scope.matches = regExp.exec($scope.eCampInput);


      while((match = regExp.exec($scope.eCampInput)) != null)
      {
                  $scope.matches.push(match[1]);
      }

      for(var i = 0; i < $scope.courses.length; i++)
      {
        for(var j = 0; j < $scope.matches.length; j++)
        {
            if($scope.matches[j] == $scope.courses[i].courseNum)
            {
                $scope.hits.push($scope.courses[i].courseString);
                if($scope.selectedCourses.indexOf($scope.courses[i].courseString + " (" + $scope.courses[i].courseNum + ")") == -1)
                  $scope.selectedCourses.push($scope.courses[i].courseString )
            }
        }
      }

      $scope.eCampInput = "";

    }

    function removeCourse(courseName)
    {
      var data = {
        "username": $scope.un,
        "course" : courseName
      }

      $http({
    url: "removeCourse.php",
    method: "POST",
    data: data
    }).success(function(response) {

    alert(response.records);

    });
    }

    function loadCourses()
    {
      //alert("loading courses");
      var data = {
        "username": $scope.un
      }

      $http({
    url: "loadCourses.php",
    method: "POST",
    data: data
    }).success(function(response) {

      $scope.selectedCourses = response.records;
    });
    }
    $scope.submitCourses = function()
    {
      var data = {
        "username": $scope.un,
        "courses": $scope.selectedCourses
      }

      $http({
    url: "submitCourses.php",
    method: "POST",
    data: data
    }).success(function(response) {
      //$scope.courseSubmitResponse = response.resp;
      //alert(response.resp);
    });


    }

   $scope.signOut = function()
   {
     if (confirm('Are you sure you want to sign out?')) {
       $scope.loggedIn = false;
       $scope.handleClick("", false, "");
       sessionStorage.setItem('username', "");
     }

   }


});
//Log In Portion
app.controller('logInCtrl', function($scope, $http, userInfo) {


  $scope.handleClick = function(msg, log) {
        $scope.$emit('handleEmit', {message: msg, loggedIn: log});
    };

    $scope.$on('handleBroadcast', function(event, args) {
         if(args.loggedIn == true && args.message != "" && args.message != null)
         {
           $scope.isLogged = true;
         }
         else {
           $scope.isLogged = false;
           $scope.pwInput = "";
           $scope.unInput = "";
           $scope.confirmPW = "";
         }
     });
  $scope.pwInput = "";
  $scope.unInput = "";
  $scope.confirmPW = "";

  $scope.registering = false;
  $scope.filled = false;
  $scope.regFilled = false;
  $scope.isLogged = false;

  $scope.username = "";

  $scope.checkFill = function()
  {
    if($scope.unInput == "" || $scope.pwInput == "")
      $scope.filled = false;
    else
      $scope.filled = true;

    if($scope.unInput == "" || $scope.pwInput == "" || $scope.confirmPW == "")
      $scope.regFilled = false;
    else
      $scope.regFilled = true;
  }

  //checks if user is in session storage
  $scope.initUser = function()
  {
    var seshUN = sessionStorage.getItem('username');
    if(seshUN == "") // no one logged in
    {

    }
    else
    {
      userInfo.setUN(seshUN);
      userInfo.setLog(true);
      $scope.isLogged = true;
       $scope.handleClick(seshUN, true);

    }

  }


  $scope.checkUsername = function()
  {
    //data.setPoop($scope.unInput);
    var result;
    var data = {
      "username": $scope.unInput,
      "password": $scope.pwInput
    }
      $http({
    url: "testDB.php",
    method: "POST",
    data: data

}).success(function(response) {
  result = response;
  if(result.attempt == "E")
  {
    if(result.match == "matchPW")
    {
      $scope.result = "Succesfull login";
      userInfo.setUN($scope.unInput);
      userInfo.setLog(true);

      sessionStorage.setItem('username', $scope.unInput);
      $scope.isLogged = true;
       $scope.handleClick($scope.unInput, true);


      jQuery('#myModal').modal('hide'); // hide modal
    }
    else
      $scope.result = "Wrong password";
  }
  else
    $scope.result = "USER DOES NOT EXIST";

  //$scope.result = result.match;
});


  }

$scope.register = function()
{
  if($scope.pwInput != $scope.confirmPW)
    alert("passwords dont match");
  else {

  var data = {
    "username": $scope.unInput,
    "password": $scope.pwInput
  }

  $http({
url: "addUser.php",
method: "POST",
data: data
}).success(function(response) {
  //alert(response.resp);
  if(response.resp == "Registration Succesfull")
  {
    //sign the user in
    userInfo.setLog(true);
    userInfo.setUN($scope.unInput);
    $scope.isLogged = true;
    sessionStorage.setItem('username', $scope.unInput);

    $scope.isLogged = true;
     $scope.handleClick($scope.unInput, true);

    jQuery('#myModal').modal('hide'); // hide modal
  }
    //jQuery('#myModal').modal('hide'); // hide modal
});

  }

}


});





//countroller for adding courses
app.controller('addCourseCtrl', function($scope, $http, userInfo) {

$scope.courseInput = "";
$scope.hits =[];
$scope.isLogged = false;
$scope.selectedCourses = [];
$scope.ERROR = "None";
var availableTags = [];
var a2 = [];
function onlyUnique(value, index, self) {
return self.indexOf(value) === index;
}

$http.get("results.json")
  .success(function (response)
  {
          $scope.courses = response.records;

          for(var i = 0; i < response.records.length; i++)
          {
            availableTags.push( response.records[i].courseString);

          }
          a2 = availableTags.filter(onlyUnique);

  });


  $scope.removeCourse = function(name)
  {
    var index = $scope.selectedCourses.indexOf(name)
    $scope.selectedCourses.splice(index, 1);

  }

  $scope.addCourse = function()
  {
    var i;
    for (i = 0; i < a2.length; i++)
    {
      if($scope.courseInput == a2[i])
      {
        $scope.ERROR = "Matched";
        break;
      }

    }
    if (i < a2.length) // is valid input
    {
      $scope.selectedCourses.push($scope.courseInput);
      $scope.courseInput = "";
    }
    else //invalid input
    {
      $scope.ERROR = "BAD INPUT" + i;
    }
  }

  $scope.eCamp = function()
  {

    $scope.hits = [];
    $scope.matches = [];
    //$scope.selectedCourses = [];
    var match;
    var regExp = /\((.*?)\)/g;
    //$scope.matches = regExp.exec($scope.eCampInput);


    while((match = regExp.exec($scope.eCampInput)) != null)
    {
                $scope.matches.push(match[1]);
    }

    for(var i = 0; i < $scope.courses.length; i++)
    {
      for(var j = 0; j < $scope.matches.length; j++)
      {
          if($scope.matches[j] == $scope.courses[i].courseNum)
          {
              $scope.hits.push($scope.courses[i].courseString);
              if($scope.selectedCourses.indexOf($scope.courses[i].courseString + " (" + $scope.courses[i].courseNum + ")") == -1)
                $scope.selectedCourses.push($scope.courses[i].courseString )
          }
      }
    }

    $scope.eCampInput = "";

  }

  function loadCourses()
  {

    var data = {
      "username": $scope.un
    }

    $http({
  url: "loadCourses.php",
  method: "POST",
  data: data
  }).success(function(response) {

    $scope.selectedCourses = response.records;
  });


  }

  $scope.openModal = function()
  {
    //alert("open modal");
      //$scope.un = shareUsername.getUN();
      $scope.un = userInfo.getUN();

      loadCourses();
      if(userInfo.getLog() == false)
      {

        alert("not loggedIn");
        //jQuery('#addCourseModal').modal('hide'); // hide modal
      }
      else
      {
        //$scope.isLogged = userInfo.getLog();
      }

  }


  $scope.submitCourses = function()
  {
    var data = {
      "username": $scope.un,
      "courses": $scope.selectedCourses
    }

    $http({
  url: "submitCourses.php",
  method: "POST",
  data: data
  }).success(function(response) {
    //$scope.courseSubmitResponse = response.resp;
    //alert(response.resp);
  });


  }


});
