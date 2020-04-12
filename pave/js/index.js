"use strict";

import {load_vis_nodes} from './vis_nodes.js';
import {load_data_from_default, load_data_from_user} from './data_input_handler.js';

// Global variables
var slider = document.getElementById("daypicker");
var dataset_upload = document.getElementById("dataset_upload");
var mymap;
var earth;
var services_nodes;

// Manage workflow
window.onload = function() {

    // initialize the map on the "map" div with a given center and zoom
    mymap = L.map('mapid', {
        center: [51.455, -2.599],
        zoom: 13
    });

    // Load map of Bristol
    earth = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicGF2ZS1oZWFsdGgiLCJhIjoiY2s3dWQxZHUzMTZlYTNncXR1OHB2NTBkYiJ9.7mf8ut1FJpHCFzcsy7qiDA'
    });
    earth.addTo(mymap);

    // Load Data Vis from data
    services_nodes = load_data_from_default();
    setTimeout(function() {load_vis_nodes(mymap, services_nodes[0]); document.getElementById("datadate").innerHTML = services_nodes[0].date;}, 3000);
};

// Load all data from csv files
async function load_csv_files() {
  var services = [];
  slider.value = 0;
  slider.max = dataset_upload.files.length - 1;

  for (let i = 0; i < dataset_upload.files.length; i++) {
    var reader = new FileReader();
    var file = dataset_upload.files[i];

    reader.onload = async function() {
      var service = await load_data_from_user(reader.result, dataset_upload.files[i].name.replace(/\.csv/g, ''));
      services.push(service);
    };
    reader.onerror = error => reject(error)
    reader.readAsText(file);
  };

  services_nodes = services;
};

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
  });
  earth.addTo(mymap);
  load_vis_nodes(mymap, services_nodes[this.value]);
  document.getElementById("datadate").innerHTML = services_nodes[this.value].date;
};

// File Upload handler
dataset_upload.onchange = async function () {
  services_nodes = [];

  // Load files into services_nodes
  await load_csv_files();

  // Redraw map
  mymap.eachLayer(function (layer) {
    mymap.removeLayer(layer);
  });
  earth.addTo(mymap);
  setTimeout(function() {load_vis_nodes(mymap, services_nodes[0]); document.getElementById("datadate").innerHTML = services_nodes[0].date;}, 3000);
};
