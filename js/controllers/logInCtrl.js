/* logInCtrl. Controller for the Log in Modal. Handles Log in and
Registration of new users.
*/
app.controller('logInCtrl', function($scope, $http, userInfo) {


  $scope.pwInput = "";
  $scope.unInput = "";
  $scope.confirmPW = "";

  //form validation boolean variables
  $scope.registering = false;
  $scope.filled = false;
  $scope.regFilled = false;
  $scope.isLogged = false;

  $scope.username = "";

  /*Function: handleClick
    Description: Emits message and loggedIn state to the broadcast. message
    is the username, and loggedIn is the loggedIn status of the user
  */
  $scope.handleClick = function(msg, log) {
        $scope.$emit('handleEmit', {message: msg, loggedIn: log});
    };

  /*Function: on(Broadcast)
    Description: Handles broadcast information. Defaults the user info
    when the user loggs out.
  */
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


  /*Function: checkFill
    Description: This function is called whenever the form has changed.
    Updates the form validation booleans based on the input.
  */
  $scope.checkFill = function()
  {
    //regex for SCU Email
    $scope.isSCUEmail = ($scope.unInput).match(/^[A-Z0-9._%+-]+@scu.edu$/i);

    if($scope.unInput == "" || $scope.pwInput == "")
      $scope.filled = false;
    else
      $scope.filled = true;

    if($scope.unInput == "" || $scope.pwInput == "" || $scope.confirmPW == "")
      $scope.regFilled = false;
    else
      $scope.regFilled = true;
  }

  /*Function: initUser
    Description: If the sessionStorage username is active (user is logged in), then
    it updates user info in this controller, the factory, and in the broadcast
  */
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


  /*Function: checkUsername
    Description: Handles the loggin in functionality. Sends username and password to
    the database and checks their validity. If login info is valid, it calls the logIn
    function
  */
  $scope.checkUsername = function()
  {
    var result;

    var data = {
      "username": $scope.unInput,
      "password": $scope.pwInput
    }
      $http({
        url:  "../php/logIn.php",
        method: "POST",
        data: data
    }).success(function(response) {
        result = response;

        if(result.attempt == "E") //user exists
        {
          if(result.match == "matchPW") //username matches password
          {
            $scope.result = "Succesfull login";
            logIn();
          }
          else //user exists, wrong password though
          {
              $scope.result = "Wrong password";
              alert("Wrong password");
          }
        }
        else //user doesn't exist
        {
          $scope.result = "USER DOES NOT EXIST";
          alert("User Does not exist");
        }

      });

  }

  /*Function: Register
    Description: Initializes the user in the database with their
    provided username and password.
  */
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
        url: "../php/addUser.php",
        method: "POST",
        data: data
    }).success(function(response) {
      if(response.resp == "Registration Succesfull")
      {
        logIn();
        $scope.registering = false;
      }

    });

   }

  }

  /*Function: logIn
    Description: Handles frontend functionality of logIn controller by updating
    info in the factory, session storage, broadcast, and local scope variables
  */
  function logIn()
  {
    //factory info
    userInfo.setUN($scope.unInput);
    userInfo.setLog(true);

    //session storage
    sessionStorage.setItem('username', $scope.unInput);

    //broadcast
    $scope.handleClick($scope.unInput, true);

    //hide modal and update scope variables
    jQuery('#myModal').modal('hide'); // hide modal
    $scope.isSCUEmail = false;
    $scope.isLogged = true;

  }

//end of controller
});
