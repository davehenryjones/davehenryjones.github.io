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
        services_appointments.push(data[i].appointments);
      };
      resolve();
    });
  });

  promise
    .then(function() {
      for (let i = 0;i<services_x.length;i++) {
        // Draw node
        var circle = L.circle([services_x[i], services_y[i]], {
            color: 'black',
            weight: '0.5',
            fillColor: '#00a99d',
            fillOpacity: 0.7,
            radius: services_appointments[i] / 20
          }).addTo(svg);

        // Add extra information popup
        circle.on('mouseover', function (event) {
          var info_popup = L.popup()
           .setLatLng(event.latlng)
           .setContent('Location: ' + services_location[i] + '<br>Name: ' + services_name[i] + '<br>Appointments: ' + services_appointments[i])
           .openOn(svg);
          });

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
      };
      resolve();
    });
  });

  promise
    .then(function() {
      for (let i = 0;i<services_x.length;i++) {
        var circle = L.circle([services_x[i], services_y[i]], {
            color: 'black',
            weight: '0.5',
            fillColor: '#f15a24',
            fillOpacity: 0.7,
            radius: services_capacity[i] * 25
          }).addTo(svg);
      };

    })
    .catch(function() {
      console.log("Error Loading Capacity");
    });

  return [services_location, services_x, services_y, services_name, services_capacity];
};


// TODO Load data from a csv to create nodes
// export function load_vis_nodes_auto(svg, grid_ref, csv_path) {
//   var services = [];
//
//   var promise = new Promise (function (resolve, reject) {
//     //return d3.csv(csv_path, function(data) {
//     return d3.csv(csv_path, function(data) {
//       Object.keys(data[0]).forEach(function (column) {
//         services.push({
//           key: column,
//           value: []
//         });
//       });
//
//       for (let i = 0; i < data.length; i++) {
//         for (let j = 0; j < Object.keys(services).length; j++) {
//           services[j].push(data[i][j]);
//         };
//       };
//       resolve();
//     });
//   });
//
//   promise
//     .then(function() {
//       // for (let i = 0; i < services.[0].length; i++) {
//       //   var circle = L.circle([services_x[i], services_y[i]], {
//       //       color: 'none',
//       //       fillColor: '#ff7e7e',
//       //       fillOpacity: 0.8,
//       //       radius: services_appointments[i] * 25
//       //     }).addTo(svg);
//       // };
//       console.log("Work in progress")
//     })
//     .catch(function() {
//       console.log("Error Loading Nodes");
//     });
//
//   return [services_location, services_x, services_y, services_name, services_appointments];
// };
