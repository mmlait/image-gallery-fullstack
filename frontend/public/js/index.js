function cookieAlert(){
  setTimeout(function(){
    swal({
      title: 'This website uses cookies.',
      text: 'By continuing to use this website you accept the use of cookies.',
      button: 'Ok'
    })
  }, 1500);
};

$(document).ready(function(){
  // show sign in form
  $("#sign-in-link").click(function(){
    $("#sign-in").show();
    $("#register").hide();
    $("#x").addClass("focus-link");
    $("#y").removeClass("focus-link");
    $("#sign-in-link").addClass("disabled").addClass("disabled-link");
    $("#register-link").removeClass("disabled").removeClass("disabled-link");
  });

  // show register form
  $("#register-link").click(function(){
    $("#register").show();
    $("#sign-in").hide();
    $("#y").addClass("focus-link");
    $("#x").removeClass("focus-link");
    $("#register-link").addClass("disabled").addClass("disabled-link");
    $("#sign-in-link").removeClass("disabled").removeClass("disabled-link");
  });
});
