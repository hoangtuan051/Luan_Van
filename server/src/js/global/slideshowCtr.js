(function($) { // Begin jQuery
  $(function() { // DOM ready
      var slideIndex = 0;
      function showSlides(n) {
        var slides = $(".mySlides");
        var dots = $(".dot");
        if (n >= slides.length) {
          slideIndex = 0;
        }    
        if (n < 0) {
          slideIndex = slides.length  - 1;
        }
        slides.hide();
        $(slides[slideIndex]).show();
        dots.removeClass("active"); 
        $(dots[slideIndex]).addClass("active");
      }
      showSlides(slideIndex);
      $(".dot").click(function(){
           slideIndex = parseInt($(this).data("index"));
          showSlides(slideIndex);
      });
      $(".prev").click(function(){
          slideIndex -= 1;
          showSlides(slideIndex);
      });
      $(".next").click(function(){
          slideIndex += 1;
          showSlides(slideIndex);
      });

  }); // end DOM ready
})(jQuery); // end jQuery