$(document).ready(function(){
    // localStorage.clear();
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
     $('[data-toggle="tooltip"]').tooltip(); 
    // alert(parseInt(localStorage.getItem("countTabs")));
  $('#login_signup').on('hidden.bs.modal', function () {
        $('#tabLg').click();
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



  function ToEnglish() {
    document.getElementById("lang").innerHTML = "Language <span class=\"caret\"></span>";
    var elems = document.getElementsByClassName('english');
    var elems2 = document.getElementsByClassName('vietnam');
    for(var i = 0; i < elems.length; i++) {
    elems[i].style.display = 'block';
    elems2[i].style.display = 'none';
    }
    document.getElementById("sentence_parse").placeholder = "Enter sentence";
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
    document.getElementById("sentence_parse").placeholder = "Nhập câu";
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
    if (typeof(Storage) !== "undefined") {
    localStorage.setItem("curLang", "vietnam");
    sessionStorage.setItem("curLang", "vietnam");
    }
  };
