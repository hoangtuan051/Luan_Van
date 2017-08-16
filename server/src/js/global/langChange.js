// localStorage.setItem("sd-lang", "viet");
function changeLanguage(setLang,translations,translations_holder,firstTime) {
	var curLang = localStorage.getItem("sd-lang");
	// alert(curLang + " set to " + setLang);
	if((curLang != setLang) || firstTime){
		$(".languageChange").each(function(index) { 
			$(this).text(translations[index][setLang]);
			// alert($(this).text());
		});
		$(".holder-languageChange").each(function(index) { 
			$(this).attr("placeholder",translations_holder[index][setLang]);
			// alert($(this).text());
		});
		localStorage.setItem("sd-lang",setLang);
	}
}

function setDefLang(translations,translations_holder){
	if (!localStorage.getItem("sd-lang")){
		// alert("null");
  		localStorage.setItem("sd-lang","english");
  	}
  	// alert(localStorage.getItem("sd-lang"));
  	changeLanguage(localStorage.getItem("sd-lang"),translations,translations_holder,true);
}

