jQuery.fx.speeds["medium-fast"] = 350;

function hideDDLexclude(showedDdl) {
	// alert("wtf");
	if(showedDdl){
		// alert("co");
		$('.myDropdownlist').not(showedDdl).hide();
		$('.myDropdownlist-btn').not(showedDdl.siblings()).each(function(){
			$(this).children().last().attr("class","fa fa-angle-down");
		});
	}
	else{
		// alert("khong");
		$('.myDropdownlist').hide();
		$('.myDropdownlist-btn').each(function(){
			$(this).children().last().attr("class","fa fa-angle-down");
		});
	}
}

(function($) { // Begin jQuery
  $(function() { 
  // DOM ready
	$(window).scroll(function(){
		if ($(this).scrollTop() > 80) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});

  }); // end DOM ready
})(jQuery); // end jQuery

function ScrollTo(el,offset) { 
    $('html, body').animate({ 
        scrollTop: $(el).offset().top - offset}, 
    'medium-fast', function() {
        $(el).focus();
    });           
} 