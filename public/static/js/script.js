var scrollSection1;
var scrollSection2;
var email;
var emailVide;
var emailNonValid;
var myreg;
var pseudo;
var nameShort;
var pass1;
var pass1Length;
var pass2;
var checkPass;


function init() {
    scrollSection1 = document.getElementById("divideSection1");
    scrollSection2 = document.getElementById("divideSection2");
    email = document.getElementById("emailInput");
    emailVide = document.getElementById("alertEmailVide");
    emailNonValid = document.getElementById("alertEmailNonValid");
    myreg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
    pseudo = document.getElementById("nameInput");
    nameShort = document.getElementById("alertNameShort");
    pass1 = document.getElementById("passInput");
    pass1Length = document.getElementById("alertPassLength");
    pass2 = document.getElementById("pass2Input");
    checkPass = document.getElementById("alertCheckPass");
}

function toSection1(){
    scrollSection1.scrollIntoView();
}

function toSection2(){
    scrollSection2.scrollIntoView();
}

function checkUserEmail() {
   if(email.value === ""){
        email.style.border = "1px solid red";
        emailVide.style.display = "block";
        emailNonValid.style.display = "none";
        return false;
    }else if(!myreg.test(email.value)){
       email.style.border = "1px solid red";
       emailVide.style.display = "none";
       emailNonValid.style.display = "block";
       return false;
    }
   else {
       email.style.border = "1px solid  #5c81a4";
       emailVide.style.display = "none";
       emailNonValid.style.display = "none";
       return true;
   }
}

function checkUserName() {

    if(pseudo.value.length <= 3){
        pseudo.style.border = "1px solid red";
        nameShort.style.display = "block";
    }

    else{
        pseudo.style.border = "1px solid  #5c81a4";
        nameShort.style.display = "none";
    }
    
}

function checkPass1() {
    if(pass1.value.length <= 5){
        pass1.style.border = "1px solid red";
        pass1Length.style.display = "block";
    }

    else{
        pass1.style.border = "1px solid  #5c81a4";
        pass1Length.style.display = "none";
    }
}

function verifyPass() {
    if(pass1.value !== pass2.value){
        pass2.style.border = "1px solid red";
        checkPass.style.display = "block";
    }

    else{
        pass2.style.border = "1px solid  #5c81a4";
        checkPass.style.display = "none";
    }
}