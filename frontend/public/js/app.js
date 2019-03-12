$(document).ready(function(){

  const btn1 = document.getElementById('sign-in-btn');
  if(btn1){
    btn1.addEventListener('click',
     function(){
       login();
     });
  }

  const btn2 = document.getElementById('register-btn');
  if(btn2){
    btn2.addEventListener('click',
     function(){
       register();
     });
  }

  // --------REGISTER-----------
  function register(){
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let email = document.getElementById("set-email").value;
    let username = document.getElementById("set-username").value;
    let password = document.getElementById("set-password").value;
    let passwordConfirmed = document.getElementById("confirm-password").value;

  // Check that email value is in the correct format (string@string.string)
    function check_email(val){
      if(!val.match(/\S+@\S+\.\S+/)){
          $("#email-check").show();
          document.getElementById("set-email").value = "";
          email = "";
      } else if( val.indexOf(' ')!=-1 || val.indexOf('..')!=-1){
          $("#email-check").show();
          document.getElementById("set-email").value = "";
          email = "";
        } else {
          $("#email-check").hide();
        }
    };

    check_email(email);

  // The password must contain at least 10 characters
    if (password.length < 10) {
      document.getElementById("set-password").value = "";
      password = "";
      document.getElementById("confirm-password").value = "";
      passwordConfirmed = "";
        $(".short-password").show();
        $("#set-password").addClass("modify");
        $("#confirm-password").addClass("modify");
    } else {
      $(".short-password").hide();
      $("#set-password").removeClass("modify");
      $("#confirm-password").removeClass("modify");
    };

    // Check that the password is typed twice correctly
    if (password !== passwordConfirmed) {
      document.getElementById("set-password").value = "";
      document.getElementById("confirm-password").value = "";
      $(".check-password").show();
      $("#set-password").addClass("modify");
      $("#confirm-password").addClass("modify");
    } else {
      $("#set-password").removeClass("modify");
      $("#confirm-password").removeClass("modify");
    }

    let formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password
    }

    let jsonForm = JSON.stringify(formData);

    if(firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      username !== "" &&
      password !== "" &&
      passwordConfirmed !== "" &&
      password === passwordConfirmed) {
        $.ajax({
            method: 'POST',
            accepts: {
              contentType: 'application/json'
            },
            contentType: 'application/json',
            url: 'http://localhost:2000/api/users/register',
            data: jsonForm,
            datatype: 'json',
            processData: false,
            error: function(jqXHR, textStatus, errorMessage) {
                console.log('User could not be registered. ' + errorMessage);
                swal({
                  title: 'Something went wrong.',
                  text: 'User could not be registered',
                  button: 'Ok'
                })
            },
            success: function(data) {
              if (JSON.stringify(data) === "{}") {
                signIn();
              } else {
                  swal({
                    title: 'Username is already taken.',
                    text: 'Please try again.',
                    button: 'Ok!'
                  })
                  document.getElementById("set-username").value = "";
                  $("#set-username").addClass("modify");
                }
            }
        });
      }
      else {
       $(".fillFields").show();
         $('input').each(function(){
            var val = $(this).val();
            $(this).toggleClass("modify", val.length == 0)
         })
    }

  // directly sign in user after registering
    function signIn() {
      $.ajax({
          method: 'POST',
          accepts: {
            contentType: 'application/json'
          },
          contentType: 'application/json',
          url: 'http://localhost:2000/api/users/authenticate',
          data: jsonForm,
          datatype: 'json',
          processData: false,
          error: function(jqXHR, textStatus, errorMessage) {
              console.log('Something went wrong. ' + errorMessage);
          },
          success: function(data) {
            document.cookie = "token=" + data.token;
            window.location.href = '/dashboard';
          }
      });
    }
  };


  // --------LOGIN-----------
  function login() {
      let username = document.getElementById("username").value;
      let password = document.getElementById("password").value;

      if (password.length < 10) {
        if (password.length > 0) {
          $("#short").show();
        };
        document.getElementById("password").value = "";
        password = "";
      };

      let formData = {
        username: username,
        password: password
      }

      let jsonForm = JSON.stringify(formData);

      if(username !== "" &&
        password !== "") {
        $(".short").hide();
        $.ajax({
            method: 'POST',
            accepts: {
              contentType: 'application/json'
            },
            contentType: 'application/json',
            url: 'http://localhost:2000/api/users/authenticate',
            data: jsonForm,
            datatype: 'json',
            processData: false,
            error: function(jqXHR, textStatus, errorMessage) {
                console.log('User could not be logged in. ' + errorMessage);
                swal({
                  title: 'User could not be logged in',
                  text: 'Check given username and password',
                  button: 'Ok'
                })
            },
            success: function(data) {
              if (data.hasOwnProperty('message')) {
                swal({
                  title: 'User could not be logged in',
                  text: 'Check given username and password',
                  button: 'Ok'
                })
                $(".short").hide();
                $("#username").addClass("modify");
                $("#password").addClass("modify");
              } else {
                document.cookie = "token=" + data.token;
                window.location.href = '/dashboard';
              }
            }
        });
      } else {
        $(".fillFields").show();
          $('input').each(function(){
             var val = $(this).val();
             $(this).toggleClass("modify", val.length == 0)
          })
        }
  };

});
