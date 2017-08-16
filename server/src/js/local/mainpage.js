var translations = [{"english":"Home","viet":"Trang chủ"},
					{"english":"Sentence Parsing","viet":"Phân tách câu"},
					{"english":"English Quiz","viet":"Quiz tiếng Anh"},
					{"english":"Home","viet":"Trang chủ"},
					{"english":"Sentence Parsing","viet":"Phân tách câu"},
					{"english":"English Quiz","viet":"Quiz tiếng Anh"},
					{"english":"Login","viet":"Đăng nhập"},
					{"english":"Smart dictionary was combined from the high-quality dictionaries with diverfied data. Have some words you need to look up - Smart Dictionary will help you build your vocabulary in a systematic way.",
					"viet":"Smart dictionary được tổng hợp từ nhiều nguồn với dữ liệu từ vựng đa dạng. Bất cứ khi nào cần tra từ, Smart Dictionary sẽ giúp bạn làm việc đó một cách dễ dàng và có hệ thống hơn."},
					{"english":"Check out our currently supported dictionaries:",
					"viet":"Những từ điển đang được hỗ trợ:"},
					{"english":"+Having problems with find the exact meaning in certain contexts?",
					"viet":"+Gặp khó khăn khi xác định nghĩa của từ?"},
					{"english":"Don't worry! Smart Dictionary will help you get rid of it with its",
					"viet":"Đừng lo! Smart Dictionary sẽ giúp bạn tra từ một cách dễ dàng hơn"},
					{"english":"Sentence parsing",
					"viet":"Phân tách câu"},
					{"english":"Enter your sentence or paragraph, the system will divide it into meangingful words and show the meanging of words based on the sentence/paragraph's context.",
					"viet":"Nhập câu hay đoạn văn, hệ thống sẽ phân tách câu thành những từ có nghĩa và hiển thị nghĩa trong một ngữ cảnh nhất định."},
					{"english":"+Don't just search new words, improve your vocabulary",
					"viet":"+Không chỉ tra từ, nâng cao vốn từ vựng của bạn"},
					{"english":"Smart Dictionary allow you to easily memorize words by adding it to your word lists and revising them with our quizs.",
					"viet":"Smart Dictionary giúp bạn dễ dàng cải thiện vốn từ vựng qua các quiz hay thêm vào word list ."},
					{"english":"Login now",
					"viet":"Đăng nhập ngay"},
					{"english":" to use these features.",
					"viet":" để sử dụng"},];

var translations_holder = [{"english":"Search word","viet":"Tìm từ"}];
(function($) { // Begin jQuery
  $(function() { // DOM ready
  	//choose dictionary
  	$(".selectlang").click(function (e){
  		var ddlist = $(this).siblings('.lang-ddl');
      	ddlist.toggle("medium-fast");

      	var arrow = $(this).children().last();
      	arrow.toggleClass("fa-angle-down");
      	arrow.toggleClass("fa-angle-up");

      	hideDDLexclude(ddlist);
  		e.stopPropagation();
  	});
    $("#ev").click(function (){
    	$("#chosen").text("Eng - Viet");
    	$(".lang-ddl").hide();
    	hideDDLexclude();
    	e.stopPropagation();
  	});  
  	$("#ve").click(function (){
    	$("#chosen").text("Viet - Eng");
    	$(".lang-ddl").hide();
    	hideDDLexclude();
    	e.stopPropagation();
  	});
  	$("#ee").click(function (){
    	$("#chosen").text("Eng - Eng");
    	$(".lang-ddl").hide();
    	hideDDLexclude();
    	e.stopPropagation();
  	});	

  	//up to search box
  	$(".thumb-btn").click(function (e){
  		ScrollTo("#searchbox",200);
  		var lang = $(this).data("langoption");
  		if (lang == "eng") {
  			$("#chosen").text("Eng - Eng");
  		}else if (lang == "engviet") {
  			$("#chosen").text("Eng - Viet");
  		}else{
  			$("#chosen").text("Viet - Eng");
  		}
    	return false;
  	});	
  	$(".thumbSlideShow-btn").click(function (e){
  		ScrollTo("#searchbox",200);
  		var lang = $(this).data("langoption");
  		if (lang == "eng") {
  			$("#chosen").text("Eng - Eng");
  		}else if (lang == "engviet") {
  			$("#chosen").text("Eng - Viet");
  		}else{
  			$("#chosen").text("Viet - Eng");
  		}
    	return false;
  	});	


  }); // end DOM ready
})(jQuery); // end jQuery