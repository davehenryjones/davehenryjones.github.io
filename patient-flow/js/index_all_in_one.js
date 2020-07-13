"use strict";

var design, nodes, edges, map;
var node_layer, edge_layer, node_label_layer, edge_label_layer;

/*  CONTROL FUNCTIONS
// These functions run when the page loads and control the flow of
// information to create the vis.
*/

// Load the map from mapbox
function load_map () {
  // initialize the map on the "map" div with a given center and zoom
  map = L.map('mapid', {
      center: [51.455, -2.599],
      zoom: 13
  });

  //Load map of Bristol
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGF2ZS1oZWFsdGgiLCJhIjoiY2s3dWQxZHUzMTZlYTNncXR1OHB2NTBkYiJ9.7mf8ut1FJpHCFzcsy7qiDA'
  }).addTo(map);
  return;
}

// On page laod
window.onload = async function() {
  create_triggers();
  await load_map(); // Async load map
  design = await new Design(); //Async load style
  load_default_nodes() // Async load nodes
  setTimeout( function() {load_default_edges(nodes);}, 5000); // Async load edges
  setTimeout( function() {
    load_vis(design, nodes, edges, map);
  }, 10000); // Async load vis


  // TODO Delete this
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGF2ZS1oZWFsdGgiLCJhIjoiY2s3dWQxZHUzMTZlYTNncXR1OHB2NTBkYiJ9.7mf8ut1FJpHCFzcsy7qiDA'
  }).addTo(map);
}

/*  EDGE Functions
// These functions control edges in the vis
*/

// Edge object
// Inputs: Node start_node, Node end_node, Dict(diagnosis : weight) weights
// TODO Implement diagnoses (just 'all' for now)
class Edge {
  constructor(start_node=null, end_node=null, weights=null, is_visible=true) {
    this.start_node =  start_node;
    this.end_node = end_node;
    this.weights = weights;
    this.is_visible = is_visible;
    this.layer = null;
    this.label = null;
  }

  toggle_visible() {
    this.is_visible = !this.is_visible;
  }
}

// Load Default Edges
async function load_default_edges(nodes) {
  edges = [];

  await d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/referrals_list_combined.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
      let start_node = nodes.filter(node => node.location == data[i].source)[0];
      let end_node = nodes.filter(node => node.location == data[i].dest)[0];
      let edge = new Edge (start_node, end_node, {"all" : data[i].referrals});
      edges.push(edge);
    };
  });

  return;
}

/*  NODES Functions
// These functions control nodes in the vis
*/

// Node object
// Inputs: Float x, Float y, String location, String name, Dict(diagnosis : weight) weights
// TODO Implement diagnoses (just 'all' for now)
class Node {
  constructor(x=null, y=null, location=null, name=null, weights=null, is_visible=true) {
    this.x =  x;
    this.y = y;
    this.location = location;
    this.name = name;
    this.weights = weights;
    this.is_visible = is_visible;
    this.layer = null;
    this.label = null;
  }

  toggle_visible() {
    this.is_visible = !this.is_visible;
  }
}

// API Call
async function get_coords(api_address) {
  let response = await fetch (api_address);
  let data = await response.json();
  return data;
};

// Load Default Nodes
async function load_default_nodes() {
  nodes = [];

  d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_list.csv", async function(data) {
    for (let i = 0; i < data.length; i++) {
      // Get map co-ordinates from postcode
      var api_address = ("https://api.postcodes.io/postcodes/").concat(data[i].location.replace(/\s/g, ''));
      var api_data = await get_coords(api_address);
      let x = api_data.result.latitude;
      let y = api_data.result.longitude;
      let node = new Node(x, y, data[i].location, data[i].name, {"all" : data[i].appointments})
      nodes.push(node);
    };
  });

  return;
}


/*  MODIFY Functions
// These functions control the vis filters and design
*/

// Design object
class Design {
  constructor(min_weight = 0, max_weight = -1, colours = {"nodes" : '#ff7e7e',
    "edges" : '#00ffff'}, node_scaling = 0.05, edge_scaling = 0.002, show_labels = false) {
      this.min_weight = min_weight;
      this.max_weight = max_weight;
      this.colours = colours;
      this.node_scaling = node_scaling;
      this.edge_scaling = edge_scaling;
      this.show_labels = show_labels;
  }
}

// Load vis nodes
function load_vis_nodes(nodes, design, map) {
  node_layer = L.layerGroup()
  node_label_layer = L.layerGroup();

  for (let i = 0; i < nodes.length; i++) {
    // Draw node
    var c = L.circle([nodes[i].x, nodes[i].y], {
      color: 'none',
      fillColor: design.colours.nodes,
      fillOpacity: 0.8,
      radius: nodes[i].weights.all * design.node_scaling
    });
    node_layer.addLayer(c);

    // Add extra information popup
    c.on('mouseover', function (event) {
      L.popup()
       .setLatLng(event.latlng)
       .setContent('<br></br><b>Name:</b> ' + nodes[i].name
          + '<br></br><b>Location:</b> ' + nodes[i].location
          + '<br></br><b>Appointments:</b> ' + nodes[i].weights.all)
       .openOn(map);
    });

    // Create label text
    var l = L.tooltip({permanent : true});
    l.setLatLng(new L.LatLng(nodes[i].x, nodes[i].y));
    l.setContent(nodes[i].weights.all);
    node_label_layer.addLayer(l);

    nodes[i].layer = c;
    nodes[i].label = l;
  };

  node_layer.addTo(map);
}

// Load vis edges
function load_vis_edges(edges, design, map) {
  edge_layer = L.layerGroup()
  edge_label_layer = L.layerGroup();

  for (let i = 0; i < edges.length; i++) {
    // Draw edge
    var e = L.polyline([ [edges[i].start_node.x, edges[i].start_node.y], [edges[i].end_node.x, edges[i].end_node.y] ], {
      color: design.colours.edges,
      opacity: 0.8,
      weight: edges[i].weights.all * design.edge_scaling
    });
    edge_layer.addLayer(e);

    // Add extra information popup
    e.on('mouseover', function (event) {
      L.popup()
       .setLatLng(event.latlng)
       .setContent('<br></br><b>From:</b> ' + edges[i].start_node.name + ' (' + edges[i].start_node.location + ')'
          + '<br></br><b>To:</b> ' + edges[i].end_node.name + ' (' + edges[i].end_node.location + ')'
          + '<br></br><b>Referrals:</b> ' + nodes[i].weights.all)
       .openOn(map);
    });

    // Create label text
    var l = L.tooltip({permanent : true});
    l.setLatLng(L.latLngBounds(new L.LatLng(edges[i].start_node.x, edges[i].start_node.y),
      new L.LatLng(edges[i].end_node.x, edges[i].end_node.y)).getCenter());
    l.setContent(edges[i].weights.all);
    edge_label_layer.addLayer(l);

    edges[i].layer = e;
    edges[i].label = l;
  };

  edge_layer.addTo(map);
}

// Drop down postcodes
function dropdown_postcodes_init() {
  var select = document.getElementById("postcode_dropdown");
  var postcodes_found = [];
  for (let i = 0; i < nodes.length; i++) {
    let p = nodes[i].location.split(" ")[0];
    if (!postcodes_found.includes(p)) {
      postcodes_found.push(p);
    }
  }

  postcodes_found.sort();
  for (let i = 0; i < postcodes_found.length; i++) {
    select.options[select.options.length] = new Option(postcodes_found[i]);
  }
}

// Load bounds for node weight filter
function node_weight_filter_init() {
  var slider = document.getElementById("node_weight_filter");
  slider.setAttribute('min', 0);

  var max_weight = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].weights.all > max_weight) {
      max_weight = nodes[i].weights.all;
    }
  }

  slider.setAttribute('step', 1);
  slider.setAttribute('max', max_weight);
  slider.setAttribute('value', 0);
  return;
}

// Load bounds for edge weight filter
function edge_weight_filter_init() {
  var slider = document.getElementById("edge_weight_filter");
  slider.setAttribute('min', 0);

  var max_weight = 0;
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].weights.all > max_weight) {
      max_weight = edges[i].weights.all;
    }
  }

  slider.setAttribute('step', 1);
  slider.setAttribute('max', max_weight);
  slider.setAttribute('value', 0);
  return;
}

// Load bounds for node scaling
function node_scaling_init() {
  var slider = document.getElementById("node_scaling");
  slider.setAttribute('min', 0.01);
  slider.setAttribute('step', 0.01);
  slider.setAttribute('max', 1);
  slider.setAttribute('value', design.node_scaling);
  return;
}

// Load bounds for edge scaling
function edge_scaling_init() {
  var slider = document.getElementById("edge_scaling");
  slider.setAttribute('min', 0.002);
  slider.setAttribute('step', 0.0002);
  slider.setAttribute('max', 0.01);
  slider.setAttribute('value', design.edge_scaling);
  return;
}

// Load Vis
async function load_vis(design, nodes, edges, map) {
  await load_vis_edges(edges, design, map);
  await load_vis_nodes(nodes, design, map);
  dropdown_postcodes_init();
  node_weight_filter_init();
  edge_weight_filter_init();
  node_scaling_init();
  edge_scaling_init();
  return;
}

/* MODIFY THE VIS
// Functions for modifying the visualisation
*/

// Add event listeners for modify menu
function create_triggers() {
  document.getElementById("usage_checkbox").addEventListener("change", usage_labels);
  document.getElementById("referrals_checkbox").addEventListener("change", referrals_labels);
  document.getElementById("postcode_dropdown").addEventListener("change", toggle_postcodes_visibility);
  document.getElementById("node_weight_filter").addEventListener("change", node_weight_filter);
  document.getElementById("edge_weight_filter").addEventListener("change", edge_weight_filter);
  document.getElementById("node_scaling").addEventListener("change", node_scaling);
  document.getElementById("edge_scaling").addEventListener("change", edge_scaling);
  document.getElementById("node_colour").addEventListener("change", node_colour);
  document.getElementById("edge_colour").addEventListener("change", edge_colour);
}

// Toggle usage labels
function usage_labels() {
  if (this.checked) {
    node_label_layer.addTo(map);
  } else {
    node_label_layer.removeFrom(map);
  }
}

// Toggle referrals labels
function referrals_labels() {
  if (this.checked) {
    edge_label_layer.addTo(map);
  } else {
    edge_label_layer.removeFrom(map);
  }
}

// Hide nodes and arrows from postcodes
function toggle_postcodes_visibility() {
  // Toggle node
  for (let i = 0; i < nodes.length; i++) {
    if (this.value == nodes[i].location.split(" ")[0]) {
      if (map.hasLayer(nodes[i].layer)) {
        nodes[i].layer.removeFrom(map);
        nodes[i].label.removeFrom(map);
      } else {
        nodes[i].layer.addTo(map);
      }
    }
  }

  // Toggle edges
  for (let i = 0; i < edges.length; i++) {
    if (this.value == edges[i].start_node.location.split(" ")[0]) {
      if (map.hasLayer(edges[i].layer)) {
        edges[i].layer.removeFrom(map);
        edges[i].label.removeFrom(map);
      } else {
        edges[i].layer.addTo(map);
      }
    }
  }
}

// Handle node weight filter
function node_weight_filter() {
  const min_val = Number (this.value);
  for (let i = 0; i < nodes.length; i++) {
    if (min_val > Number(nodes[i].weights.all) && map.hasLayer(nodes[i].layer)) {
      nodes[i].layer.removeFrom(map);
      nodes[i].label.removeFrom(map);
    } else if (min_val <= Number(nodes[i].weights.all) && !map.hasLayer(nodes[i].layer)) {
      nodes[i].layer.addTo(map);
    }
  }
  return;
}

// Handle edge weight filter
function edge_weight_filter() {
  const min_val = Number (this.value);
  for (let i = 0; i < edges.length; i++) {
    if (min_val > Number(edges[i].weights.all) && map.hasLayer(edges[i].layer)) {
      edges[i].layer.removeFrom(map);
      edges[i].label.removeFrom(map);
    } else if (min_val <= Number(edges[i].weights.all) && !map.hasLayer(edges[i].layer)) {
      edges[i].layer.addTo(map);
    }
  }
  return;
}

// Handle node scaling
function node_scaling() {
  let adjust_scale = Number(this.value) / Number(design.node_scaling);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].layer.setRadius(nodes[i].layer.getRadius() * adjust_scale);
  }
  design.node_scaling = this.value;
  return;
}

// Handle edge scaling
function edge_scaling() {
  let adjust_scale = Number(this.value) / Number(design.edge_scaling);
  for (let i = 0; i < edges.length; i++) {
    edges[i].layer.setStyle({'weight': edges[i].layer.options.weight * adjust_scale});
  }
  design.edge_scaling = this.value;
  return;
}

// Handle node colour picker
function node_colour() {
  if (this.value.match('[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]')) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].layer.setStyle({'fillColor': '#' + this.value});
    }
    design.colours.nodes = this.value;
  }
  return;
}

// Handle edge colour picker
function edge_colour() {
  if (this.value.match('[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]')) {
    for (let i = 0; i < edges.length; i++) {
      edges[i].layer.setStyle({'color': '#' + this.value});
    }
    design.colours.edges = this.value;
  }
  return;
}
