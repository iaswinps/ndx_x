function red(){
    document.body.style.backgroundColor= "red";
}

function blue(){
    document.body.style.backgroundColor= "blue";
}

function white(){
    document.body.style.backgroundColor= "white";
}

function insta(){
    document.querySelector("h1").innerHTML="Ikka";
}

function fb(){
    document.querySelector("h1").innerHTML="Riyan Kakku";
}

function reset(){
    document.querySelector("h1").innerHTML="Pattalam Revanth";
}

function ikkuhide(){
    document.getElementsByTagName("p")[0].style.display= "none";
    document.querySelector("img").style.display="none";
}

function ikkushow(){
    document.getElementsByTagName("p")[0].style.display= "block";
    document.querySelector("img").style.display="block";
}