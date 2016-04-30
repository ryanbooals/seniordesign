/* rightContentCtrl. Controller for the content on the right side of the page.
Mostly the adding and removing courses funcitonality, as well as changing the
current course page
*/
app.controller('rightContentCtrl', function($scope, $http, userInfo) {

  $scope.stopAnimation = false;
  $scope.loggedIn = false;
  $scope.courseInput = "";
  $scope.hits =[];
  $scope.isLogged = false;
  $scope.selectedCourses = [];
  $scope.ERROR = "None";

  var availableTags = [];
  var a2 = []; //array of all classes

  //populates available tags and a2 arrays
  $http.get("results.json")
    .success(function (response)
    {
            $scope.courses = response.records;

            for(var i = 0; i < response.records.length; i++)
            {
              availableTags.push(response.records[i].courseString);

            }
            a2 = availableTags.filter(onlyUnique);
    });



  /*Function: on(handleBroadcast)
    Description: Handles the broadcast events. Loads the user's courses
    when they log in.
  */
  $scope.$on('handleBroadcast', function(event, args) {

       if(args.loggedIn && args.message != "" && args.message != null)
       {
         $scope.un = args.message;
         $scope.loggedIn = true;
         loadCourses();
       }
       if(!args.loggedIn)
       {
         $scope.loggedIn = false;
       }
       if(args.coursename)
       {
         $scope.loggedIn = true;
       }

   });


   $scope.animateIt = function()
   {
    //animateWithColor('#f37736');
    changInputClass('red');
   }

   function changInputClass(color)
   {
     if(color == 'red')
     {
     }
   }

   function animateWithColor(color){
     if(!$scope.stopAnimation)
     {
     if(color == 'red')
     {
       jQuery('#animate').animate({

        'borderColor': color
      },500, // Animation-duration
        function(){
            animateWithColor('black');
        });
      }
      else
      {
        jQuery('#animate').animate({

         'borderColor': '#000000'
       },500, // Animation-duration
         function(){
             animateWithColor('red');
         });
      }
    }
    else {
      jQuery('#animate').animate({

       'borderColor': '#000000'
     },500, // Animation-duration
       function(){

       });
    }
    }
   /*Function: checkUnspacedInput
     Description: for when people try to type in an unspaced course number in the input
     (i.e COEN21 instead of COEN 21). it adds a space to the input after the first four
     letters if it detcts the fourletters followed by a number (i.e COEN2 turns into COEN 2)
   */
   $scope.checkUnspacedInput = function()
   {
     if($scope.courseInput.match(/^[A-Za-z]{4}\d{1}$/))
       $scope.courseInput= [$scope.courseInput.slice(0, 4), " ", $scope.courseInput.slice(4)].join('');
   }

   /*Function: handleClick
     Description: Handles emision of broadcast, username, loggedIn status, and coursename
   */
   $scope.handleClick = function(msg, log, course) {
         $scope.$emit('handleEmit', {message: msg, loggedIn: log, coursename: course});
     };


    /*Function: changeCourse
      Description: Called when the user selects a course. Sends a broudcast with the
      coursename to the other controllers so they can update the view
    */
    $scope.changeCourse = function(courseName)
    {
      $scope.handleClick("", true, courseName);
    }

    /*Function: removeCourse
      Description: Removes the course that the user selcted to remove via the 'X'
      next to the coursename. First removes it from the slectedCourses array, then
      removes it vhrough the (non-scoped) removeCourse funciton
    */
    $scope.removeCourse = function(name)
    {
      var index = $scope.selectedCourses.indexOf(name)
      $scope.selectedCourses.splice(index, 1);
      removeCourse(name);
    }



    /*Function:addCourse
      Description: After checking that the course input valid, it
      adds the course from the autocomplete input to the selectedCourses
      array. Then updates the user's courses via the submitCourses funciton
    */
    $scope.addCourse = function()
    {
        alert("Check 1");
        console.log(a2);

        $scope.courseInput = jQuery('#courseInput').val();
        alert($scope.courseInput);
      var i;
      for (i = 0; i < a2.length; i++)
      {
        if($scope.courseInput == a2[i])
        {
          $scope.ERROR = "Matched";
            alert("Check 2");

          break;
        }

      }
      if (i < a2.length) // is valid input
      {
        if(!(contains($scope.selectedCourses, $scope.courseInput))) // not already added
        {
          $scope.selectedCourses.push($scope.courseInput);
          $scope.submitCourses();
            $scope.changeCourse($scope.courseInput);
        }
          $scope.courseInput = "";
      }
      else //invalid input
      {
        $scope.ERROR = "BAD INPUT" + i;
      }
    }


    /*Function: eCamp
      Description: populates the selctedCourses array from the user's pasted
      ECAMPUS schedule by matching the course numbers in parentheses to the corresponding
      course numbers in the courses array
    */
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

      //match courses in Paste to Actuall courses array
      for(var i = 0; i < $scope.courses.length; i++)
      {
        for(var j = 0; j < $scope.matches.length; j++)
        {
            if($scope.matches[j] == $scope.courses[i].courseNum)
            {
                $scope.hits.push($scope.courses[i].courseString);
                if($scope.selectedCourses.indexOf($scope.courses[i].courseString + " (" + $scope.courses[i].courseNum + ")") == -1)
                  if(!(contains($scope.selectedCourses, $scope.courses[i].courseString)))
                    $scope.selectedCourses.push($scope.courses[i].courseString )
            }
        }
      }


      $scope.submitCourses();
      $scope.eCampInput = "";

    }


    /*Function: submitCourses
      Description: Submits the courses in the selectedCourses array to the database
    */
    $scope.submitCourses = function()
    {
      $scope.selectedCourses.sort();

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
   /*Function: removeCourse
     Description: removes the given course from the usercourses table in the
     database.
   */
   function removeCourse(courseName)
   {
     var data = {
       "username": $scope.un,
       "course" : courseName
     }

     $http({
   url: "../php/removeCourse.php",
   method: "POST",
   data: data
   }).success(function(response) {

   });
   }

   /*Function: loadCourses
     Description: loads the users courses from the usercourses table in the database.
     The reponse is an array of the users courses, which we set selectedCourses equal
     to
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

   /*Function: onlyUnique
     Description: filters an array to have no duplicate values
   */
   function onlyUnique(value, index, self) {
     return self.indexOf(value) === index;
   }

   /*Function: contains
     Description: returns true if array a has object obj
   */
   function contains(a, obj) {
   for (var i = 0; i < a.length; i++) {
       if (a[i] === obj) {
           return true;
       }
     }
     return false;
   }

//end of controler
});
