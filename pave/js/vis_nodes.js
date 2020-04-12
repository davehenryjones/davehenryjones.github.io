// Load data from csv to create nodes
export function load_vis_nodes(svg, services_nodes) {

  for (let i = 0; i < services_nodes.location.length; i++) {
    // Check data is present
    if (typeof services_nodes.x[i] == 'undefined') {continue;};
    if (typeof services_nodes.y[i] == 'undefined') {continue;};
    if (typeof services_nodes.appointments[i] == 'undefined') {continue;};
    if (typeof services_nodes.capacity[i] == 'undefined') {continue;};

    // Draw capacity
    var circle_capacity = L.circle([services_nodes.x[i], services_nodes.y[i]], {
        color: 'black',
        weight: '0.5',
        fillColor: '#1E88E5',
        fillOpacity: 0.7,
        radius: services_nodes.capacity[i] / 20
    }).addTo(svg);

    // Draw node
    var circle_usage = L.circle([services_nodes.x[i], services_nodes.y[i]], {
        color: 'black',
        weight: '0.5',
        fillColor: '#FFC107',
        fillOpacity: 0.7,
        radius: services_nodes.appointments[i] / 20
    }).addTo(svg);

    // Create string from metadata
    var metadata_string = "";
    for (let j = 0; j < services_nodes.metadata[i].length; j++) {
      metadata_string = metadata_string + "<br> + "
        + services_nodes.metadata[i][j][0] + ": "
        + services_nodes.metadata[i][j][1];
    };

    // Add extra information popup
    circle_usage.on('mouseover', function (event) {
      var info_popup = L.popup()
       .setLatLng(event.latlng)
       .setContent('<b>Location:</b> ' + services_nodes.location[i]
          + '<br><b>Name:</b> ' + services_nodes.name[i]
          + '<br><b>Appointments:</b> ' + services_nodes.appointments[i]
          + '<br><b>Capacity:</b> ' + services_nodes.capacity[i]
          + '<br><b>Metadata:</b> ' + metadata_string)
       .openOn(svg);
      });

    };
  return;
};
