"use strict";

function openNav() {
  document.getElementById("mySidenav").style.width = "30vw";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function openInfo() {
  document.getElementById("myInfo").style.width = "30vw";
}

function closeInfo() {
  document.getElementById("myInfo").style.width = "0";
}

function textOn() {
  document.getElementById("myText").style.opacity = "1";
  document.getElementById("mySidenav").style.overflow = "auto";
}

function textOff() {
  document.getElementById("myText").style.opacity = "0";
  document.getElementById("mySidenav").style.overflow = "hidden";
}

function textOn2() {
  document.getElementById("myText2").style.opacity = "1";
  document.getElementById("myInfo").style.overflow = "auto";
}

function textOff2() {
  document.getElementById("myText2").style.opacity = "0";
  document.getElementById("myInfo").style.overflow = "hidden";
}
