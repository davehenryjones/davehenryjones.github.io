// Load data from csv to create nodes
export function load_vis_nodes(svg, grid_ref) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_appointments = [];

  var promise = new Promise (function (resolve, reject) {
    //return d3.csv("/resources/services_list.csv", function(data) {
    return d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_list.csv", function(data) {
      for (let i = 0; i < data.length; i++) {
        services_location.push(data[i].location);
        services_x.push(grid_ref[data[i].location][0]);
        services_y.push(grid_ref[data[i].location][1]);
        services_name.push(data[i].name);
        services_appointments.push(data[i].appointments / 500);
      }
      resolve();
    });
  });

  promise
    .then(function() {
      for (let i = 0;i<services_x.length;i++) {
        var circle = L.circle([services_x[i], services_y[i]], {
            color: 'none',
            fillColor: '#ff7e7e',
            fillOpacity: 0.8,
            radius: services_appointments[i] * 25
          }).addTo(svg);
      };

    })
    .catch(function() {
      console.log("Error Loading Nodes");
    });

  return [services_location, services_x, services_y, services_name, services_appointments];
};


// Load data from csv to create capacity nodes
export function load_vis_capacity(svg, grid_ref) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_capacity = [];

  var promise = new Promise (function (resolve, reject) {
    //return d3.csv("/resources/services_dummy_capacity.csv", function(data) {
    return d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_dummy_capacity.csv", function(data) {
      for (let i = 0; i < data.length; i++) {
        services_location.push(data[i].location);
        services_x.push(grid_ref[data[i].location][0]);
        services_y.push(grid_ref[data[i].location][1]);
        services_name.push(data[i].name);
        services_capacity.push(data[i].dummy_capacity / 500);
      }
      resolve();
    });
  });

  promise
    .then(function() {
      for (let i = 0;i<services_x.length;i++) {
        var circle = L.circle([services_x[i], services_y[i]], {
            color: 'none',
            fillColor: '#3ba0ff',
            fillOpacity: 0.8,
            radius: services_capacity[i] * 25
          }).addTo(svg);
      };

    })
    .catch(function() {
      console.log("Error Loading Capacity");
    });

  return [services_location, services_x, services_y, services_name, services_appointments];
};
