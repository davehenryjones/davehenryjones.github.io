// Load data from csvs to variable
export function load_data_from_default(grid_ref) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_appointments = [];
  var services_capacity = [];

  d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_list.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
      services_location.push(data[i].location);
      services_x.push(grid_ref[data[i].location][0]);
      services_y.push(grid_ref[data[i].location][1]);
      services_name.push(data[i].name);
      services_appointments.push(data[i].appointments);
    };
  });

  d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_dummy_capacity.csv", function(data) {
    for (let i = 0; i < data.length; i++) {
      services_capacity.push(data[i].dummy_capacity);
    };
  });

  return { "location": services_location,
           "x": services_x,
           "y": services_y,
           "name": services_name,
           "appointments": services_appointments,
           "capacity": services_capacity
         };
};
