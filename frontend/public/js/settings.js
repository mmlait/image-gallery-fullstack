$(document).ready(function() {

  let currentId = "";

  // automatically displays user information on account page
  (function autoFill(){
    let strArr = document.cookie.split("=");
    let token = strArr[1];

    $.ajax({
        method: 'GET',
        headers: {
          'Authorization':'Bearer ' + token,
          'Content-Type':'application/json'
        },
        url: 'http://localhost:2000/api/users/current',
        error: function(jqXHR, textStatus, errorMessage) {
            console.log('Something went wrong. ' + errorMessage);
        },
        success: function(data) {
          currentId = data._id;
          $("#change-first-name").val(data.firstName);
          $("#change-last-name").val(data.lastName);
          $("#change-email").val(data.email);
          $("#change-username").val(data.username);
        }
    });
  })();

  // update user information
  const updateBtn = document.getElementById('update-btn');
  if(updateBtn){
    updateBtn.addEventListener('click',
    function update(){
      let firstName = document.getElementById("change-first-name").value;
      let lastName = document.getElementById("change-last-name").value;
      let email = document.getElementById("change-email").value;
      let username = document.getElementById("change-username").value;
      let password = document.getElementById("change-password").value;
      let passwordConfirmed = document.getElementById("confirm-new-password").value;

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
        document.getElementById("change-password").value = "";
        password = "";
        document.getElementById("confirm-new-password").value = "";
        passwordConfirmed = "";
          $(".short-password").show();
          $("#change-password").addClass("modify");
          $("#confirm-new-password").addClass("modify");
      } else {
        $(".short-password").hide();
        $("#change-password").removeClass("modify");
        $("#confirm-new-password").removeClass("modify");
      };

      // Check that the password is typed twice correctly
      if (password !== passwordConfirmed) {
        document.getElementById("change-password").value = "";
        document.getElementById("confirm-new-password").value = "";
        $(".check-password").show();
        $("#change-password").addClass("modify");
        $("#confirm-new-password").addClass("modify");
      } else {
        $("#change-password").removeClass("modify");
        $("#confirm-new-password").removeClass("modify");
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
          let strArr = document.cookie.split("=");
          let token = strArr[1];
          $.ajax({
              method: 'PUT',
              headers: {
                'Authorization':'Bearer ' + token,
                'Content-Type':'application/json'
              },
              accepts: {
                contentType: 'application/json'
              },
              contentType: 'application/json',
              url: 'http://localhost:2000/api/users/update?id=' + currentId,
              data: jsonForm,
              datatype: 'json',
              processData: false,
              error: function(jqXHR, textStatus, errorMessage) {
                  console.log('Something went wrong. ' + errorMessage);
                  swal({
                    title: 'Something went wrong.',
                    button: 'Ok'
                  })
              },
              success: function(data) {
                $("#change-first-name").val(data.firstName);
                $("#change-last-name").val(data.lastName);
                $("#change-email").val(data.email);
                $("#change-username").val(data.username);
                document.getElementById("change-password").value = "";
                document.getElementById("confirm-new-password").value = "";
                $(".check-password").hide();
                $(".fillFields").hide();
                swal({
                  title: 'Your information has been updated.',
                  button: 'Ok'
                })
              }
          });
        }
        else {
         $(".fillFields").show();
           $('input').each(function(){
              let val = $(this).val();
              $(this).toggleClass("modify", val.length == 0)
           })
        }
      });
  }

  // delete current user
  const deleteBtn = document.getElementById('delete-btn');
  if(deleteBtn){
    deleteBtn.addEventListener('click',
    function remove(){
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: {
          cancel: 'Cancel',
          confirm: 'Yes'
        }
      }).then(function(isConfirm) {
        if (isConfirm) {
          let strArr = document.cookie.split("=");
          let token = strArr[1];
          $.ajax({
              method: 'DELETE',
              headers: {
                'Authorization':'Bearer ' + token,
                'Content-Type':'application/json'
              },
              accepts: {
                contentType: 'application/json'
              },
              contentType: 'application/json',
              url: 'http://localhost:2000/api/users/remove?id=' + currentId,
              processData: false,
              error: function(jqXHR, textStatus, errorMessage) {
                  console.log('Something went wrong. ' + errorMessage);
                  swal({
                    title: 'Something went wrong.',
                    button: 'Ok'
                  })
              },
              success: function(data) {
                if (data.hasOwnProperty('message')) {
                  swal({
                    title: data.message,
                    button: 'Ok'
                  })
                } else {
                  swal({
                    title: 'Your information has been deleted.',
                    button: 'Ok'
                  }).then(function() {
                      window.location = '/index';
                  });
                }
              }
          });
        }
      })
    });
  }

})
