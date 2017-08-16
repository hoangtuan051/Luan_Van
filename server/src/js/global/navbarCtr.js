(function($) { // Begin jQuery
  $(function() { // DOM ready
    
    setDefLang(translations,translations_holder);
    //set def language
    if(localStorage.getItem("sd-lang") != "english"){
      $("#langOpt").children("span").text("Việt Nam");
    }

    // chang language for pages
    $("#chooseEnglish").click(function (){
      changeLanguage("english",translations,translations_holder,false);
      $("#langOpt").children("span").text("English");
    });
    $("#chooseVietnam").click(function (){
      changeLanguage("viet",translations,translations_holder,false);
      $("#langOpt").children("span").text("Việt Nam");
    });

    //Show language options for pages
    $('#langOpt').click(function(e) {

      var ddlist = $(this).siblings('.topnav-ddl');
      ddlist.toggle("medium-fast");

      var arrow = $(this).children().last();
      arrow.toggleClass("fa-angle-down");
      arrow.toggleClass("fa-angle-up");

      hideDDLexclude(ddlist);  
      e.stopPropagation();
    });
    //Show user info
    $('#useric').click(function(e) {

      var ddlist = $(this).siblings('.topnav-ddl');
      ddlist.toggle("medium-fast");

      var arrow = $(this).children().last();
      arrow.toggleClass("fa-angle-down");
      arrow.toggleClass("fa-angle-up");

      hideDDLexclude(ddlist);  
      e.stopPropagation();
    });
    
    //show side bar
    $("#burger").click(function(){
      $(".mysidenav").css("width","240px");
      $(".overlay").toggle();
      $("body").toggleClass("stopScrolling");
      hideDDLexclude();
    });
    //close side bar
    $(".myclosebtn").click(function(){
      $(".mysidenav").css("width","0px");
      $(".overlay").toggle();
      $("body").toggleClass("stopScrolling");
    });
    // click overlay,close side bar
    $(".overlay").click(function(e){
      $(".mysidenav").css("width","0px");
      $("body").toggleClass("stopScrolling");
      $(".overlay").toggle();
    });

    //close all when click main view
    $('html').click(function() {
        hideDDLexclude();
    });

  }); // end DOM ready
})(jQuery); // end jQuery