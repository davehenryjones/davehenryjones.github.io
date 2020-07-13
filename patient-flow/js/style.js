"use strict";

function openNav() {
  window.alert(`On the visualisation map, each circle represents an NHS service loaded from our dummy data source. The size of the circle corresponds to usage data for that service i.e. the bigger the circle the more patients using the service. The lines between each service represent patient referrals between services. Again, the thickness of the line corresponds to the number of referrals.

There are also filters to manipulate the visualisation. They are not the easiest to use at the moment but demonstrate some of the possible features of PAVE. The filters allow you to:
  - toggle labels on each circle/ line which represent the number of appointments/ referrals
  - show/hide services dependent on their postcode
  - filter out services with a small number of patients/ referrals\n scale the size of the circles/lines in the visualisation
  - change the colour of the circles/lines in the visualisation.`)
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
