
$(document).ready(function(){
    if (localStorage.getItem("curLang") == 'vietnam') {
        // alert("wtf1");
        // $(".english").hide();
        ToVietNam();
        var count =  parseInt(localStorage.getItem("countTabs")) + 1;
        localStorage.setItem("countTabs",count.toString());
        // alert(count.toString());   
        

    }else if(localStorage.getItem("curLang") == 'english'){
        // $(".vietnam").hide();  
        ToEnglish();
        var count =  parseInt(localStorage.getItem("countTabs")) + 1;
        localStorage.setItem("countTabs",count.toString());
        // alert(count.toString());

    }else{
        if (typeof(Storage) !== "undefined") {
            if(sessionStorage.getItem("curLang") == 'vietnam'){
                    ToVietNam();
            }else if(sessionStorage.getItem("curLang") == 'english'){
                    ToEnglish();
            }else{
                $(".vietnam").hide();
                localStorage.setItem("curLang", "english");
                sessionStorage.setItem("curLang", "english");
            }
            localStorage.setItem("countTabs", "1");
            // alert("wtf3");
        }
         
        // alert("1");
    }
    // alert(parseInt(localStorage.getItem("countTabs")));
  $('#login_signup').on('hidden.bs.modal', function () {
        $('#tabLg').click();
  });

    $('.more_exam').on('click', function () {
            if($(this).next().css("display") == "none"){
                $(this).find("span").removeClass("glyphicon glyphicon-menu-plus text-danger");
                $(this).find("span").addClass("glyphicon glyphicon-menu-down text-danger"); 
                $(this).next().css("display","block");               
            }
            else{
                $(this).find("span").removeClass("glyphicon glyphicon-menu-down text-danger");
                $(this).find("span").addClass("glyphicon glyphicon-menu-plus text-danger");  
                $(this).next().css("display","none"); 
            }
            
    });
    $('.thesaurus').on('click', function () {
            if($(this).next().css("display") == "none"){
                $(this).find("span").removeClass("glyphicon glyphicon-menu-plus text-danger");
                $(this).find("span").addClass("glyphicon glyphicon-menu-down text-danger"); 
                $(this).next().css("display","block");               
            }
            else{
                $(this).find("span").removeClass("glyphicon glyphicon-menu-down text-danger");
                $(this).find("span").addClass("glyphicon glyphicon-menu-plus text-danger");  
                $(this).next().css("display","none"); 
            }         
    });

    var popover_content =   '<div class="row">'+
                        '<a class="col-xs-8 word_list">list1</a>' +
                        '<a href="#"><span class="col-xs-2 glyphicon glyphicon-plus text-danger" style="margin-top:5px;"></span></a>' +
                        '</div>';
    
    $('.plus').popover({
            trigger:'manual',
            placement: 'bottom',
            html: 'true',
            content : popover_content,
    }).on('click',function(){
        $(this).popover('toggle');
    });
    $('html').click(function (e) {
        $('.plus').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
            return;
        });
    });   
});

$(window).on("beforeunload", function() { 
    var count =  parseInt(localStorage.getItem("countTabs")) - 1;
    localStorage.setItem("countTabs",count.toString());
    if (localStorage.getItem("countTabs") === "0") {
        localStorage.removeItem("countTabs");
        localStorage.removeItem("curLang");
    }
});

$(window).on('resize', function() {
  var win = $(this);
  if (win.width() < 791) {
    $('#def_form').removeClass('col-xs-8');
    $('#def_form').addClass('col-xs-12');
  } else {
    $('#def_form').removeClass('col-xs-12');
    $('#def_form').addClass('col-xs-8');
  }
});

  function ToEnglish() {
    document.getElementById("lang").innerHTML = "Language <span class=\"caret\"></span>";
    var elems = document.getElementsByClassName('english');
    var elems2 = document.getElementsByClassName('vietnam');
    for(var i = 0; i < elems.length; i++) {
    elems[i].style.display = 'block';
    elems2[i].style.display = 'none';
    }
    document.getElementById("findBox").placeholder = "Search Word";
    document.getElementById("username").placeholder = "User Name";
    document.getElementById("new_user").placeholder = "User Name";
    document.getElementById("password").placeholder = "Password";
    document.getElementById("password1").placeholder = "Password";
    document.getElementById("password2").placeholder = "Confirm Password";
    document.getElementById("lgTitle").innerHTML = "Login";
    document.getElementById("snTitle").innerHTML = "Sign Up";
    document.getElementById("bnLg").innerHTML = "Login";
    document.getElementById("bnSn").innerHTML = "Sign Up";
    document.getElementById("tabLg").innerHTML = "Login";
    document.getElementById("tabSn").innerHTML = "Sign Up";
    document.getElementById("defin").innerHTML = "Definition";
    document.getElementById("pronun").innerHTML = "Pronunciation";
    document.getElementById("more_exam_here").innerHTML = "More Examples";
    document.getElementById("thesau").innerHTML = "Thesaurus";
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("curLang", "english");
        sessionStorage.setItem("curLang", "english");
    }
  };
  function ToVietNam() {
    document.getElementById("lang").innerHTML = "Ngôn Ngữ <span class=\"caret\"></span>";
    var elems = document.getElementsByClassName('vietnam');
    var elems2 = document.getElementsByClassName('english');
    for(var i = 0; i < elems.length; i++) {
    elems[i].style.display = 'block';
    elems2[i].style.display = 'none';
    }
    document.getElementById("findBox").placeholder = "Tìm Từ";
    document.getElementById("username").placeholder = "Tên Đăng Nhập";
    document.getElementById("new_user").placeholder = "Tên Đăng Nhập";
    document.getElementById("password").placeholder = "Mật Khẩu";
    document.getElementById("password1").placeholder = "Mật Khẩu";
    document.getElementById("password2").placeholder = "Xác nhận mật khẩu";
    document.getElementById("lgTitle").innerHTML = "Đăng Nhập";
    document.getElementById("snTitle").innerHTML = "Đăng Ký";
    document.getElementById("bnLg").innerHTML = "Đăng Nhập";
    document.getElementById("bnSn").innerHTML = "Đăng Ký";
    document.getElementById("tabLg").innerHTML = "Đăng Nhập";
    document.getElementById("tabSn").innerHTML = "Đăng Ký";
    document.getElementById("defin").innerHTML = "Định Nghĩa";
    document.getElementById("pronun").innerHTML = "Phát Âm";
    document.getElementById("more_exam_here").innerHTML = "Thêm ví dụ";
    document.getElementById("thesau").innerHTML = "Từ đồng nghĩa - Từ trái nghĩa";
    if (typeof(Storage) !== "undefined") {
    localStorage.setItem("curLang", "vietnam");
    sessionStorage.setItem("curLang", "vietnam");
    }

  };