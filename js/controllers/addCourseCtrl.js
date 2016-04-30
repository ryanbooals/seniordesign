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

/*Factory for accessing/changing user info
Factory holds username, loggedIn status, currentCourse selected,
and the user's Courses. Methods are getter and setter functions
for these attributes (no setter for courses though)
*/
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
  url: "../php/logIn.php",
  method: "POST",
  data: data.username
    }).success(function(response) {
      //set courses to return matching courses

    });
  }

};
});


/* addCourseCtrl: Controller for adding a course. This is handles adding courses
through autocomplete selection and ECAMPUS pasting. It also handles displaying the
user courses and removing them.
*/
app.controller('addCourseCtrl', function($scope, $http, userInfo) {

  $scope.courseInput = ""; //autocomple input
  $scope.hits =[];
  $scope.isLogged = false;
  $scope.selectedCourses = []; //array of current courses
  $scope.ERROR = "None";

  var availableTags = [];
  var a2 = [];

  //filters out aray to only have unique values (aka no duplicates)
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


  /*this http GETS the values from the results.json file and puts them
  into the available tags array. It then filters the avaialbale tags array.
  These available tags are attached to the autocomplete for adding courses
  */
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

    /* Function: removeCourse
    Description: This removes the selected course (name) from the selectedCourse Array
    */
  $scope.removeCourse = function(name)
  {
    var index = $scope.selectedCourses.indexOf(name)
    $scope.selectedCourses.splice(index, 1);

  }

  /* Function: addCourse
    Description: Called when user submits course from the course finding autocomplete input.
    It first validates that the input matches a field in the a2 array (the array
  from the results.json file that populates the autocomple)
  */
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

  /* Function: eCamp
  Description: Adds courses based on the input from a user's ECAMPUS schedule. Uses regex to
  match the course number inside the parentheses to the courses in the JSON
  object
  */
  $scope.eCamp = function()
  {

    $scope.hits = [];
    $scope.matches = [];

    var match;
    var regExp = /\((.*?)\)/g;

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

    $scope.eCampInput = ""; //clear input
  }

  /* Function: loadCourses
  Description: Loads the user's course based on the username. This is called when the user
  signs in or registers, and when the user reloads the page and is already logged
  in. It makes an http request to populate the selectedCourses array
  */
  function loadCourses()
  {
    var data = {
      "username": $scope.un
    }

      $http({
    url: "../php/loadCourses.php",
    method: "POST",
    data: data
    }).success(function(response) {
      $scope.selectedCourses = response.records;
    });
  }

  /* Function: submitCourses
     Description: Updates the user's courses in the database. It is called
     whenever the user updates their courses (adds or deletes).
  */
  $scope.submitCourses = function()
  {
    var data = {
      "username": $scope.un,
      "courses": $scope.selectedCourses
    }

      $http({
    url: "../php/submitCourses.php",
    method: "POST",
    data: data
    }).success(function(response) {

    });


  }


//end of controller
});
