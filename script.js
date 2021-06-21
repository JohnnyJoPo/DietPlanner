"use strict"

function init(){
    if (window.addEventListener){
        //window.addEventListener("click", myFunction, false);
    }
    else if (window.attachEvent) {
        //window.attachEvent("onclick", myFunction);
    }
    document.getElementById("scriptCheck").remove();
}

if (window.addEventListener){
    window.addEventListener("load", init, false);
}
else if (window.attachEvent) {
    window.attachEvent("onload", init);
}