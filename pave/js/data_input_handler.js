// Load data from preselected csvs to variable
export function load_data_from_default() {
  return [
    load_data_from_file("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/20200430.csv", "20200430"),
    load_data_from_file("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/20200501.csv", "20200501"),
    load_data_from_file("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/20200502.csv", "20200502")
  ];
}

// Load data from preselected csvs to variable
export function load_data_from_user(text_snippet, data_date) {
  return load_data_from_text(text_snippet, data_date);
}

// Load date from specified file
function load_data_from_file(data_src, data_date) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_appointments = [];
  var services_capacity = [];
  var services_metadata = [];

  d3.csv(data_src, async function(data) {

    // Get column headers
    var extra_columns = Object.keys(data[0]);

    // Remove colleted columns
    extra_columns.splice(extra_columns.indexOf("location",),1);
    extra_columns.splice(extra_columns.indexOf("name",),1);
    extra_columns.splice(extra_columns.indexOf("appointments",),1);
    extra_columns.splice(extra_columns.indexOf("capacity",),1);

    // Save data
    for (let i = 0; i < data.length; i++) {
      services_location.push(data[i].location);
      services_name.push(data[i].name);
      services_appointments.push(data[i].appointments);
      services_capacity.push(data[i].capacity);

      // metadata saving
      var extra_data = [];
      for (let j = 0; j < extra_columns.length; j++) {
        extra_data.push([extra_columns[j], data[i][extra_columns[j]]]);
      };
      services_metadata.push(extra_data);

      // Get co-ordinates
      var api_address = ("http://api.postcodes.io/postcodes/").concat(services_location[i].replace(/\s/g, ''));
      var api_data = await get_coords(api_address);
      services_x.push(api_data.result.latitude);
      services_y.push(api_data.result.longitude);
    };
  });

  return {
           "date": data_date,
           "location": services_location,
           "x": services_x,
           "y": services_y,
           "name": services_name,
           "appointments": services_appointments,
           "capacity": services_capacity,
           "metadata": services_metadata
         };
};

async function get_coords(api_address) {
  let response = await fetch (api_address);
  let data = await response.json();
  return data;
};

// TODO
// Load date from specified file
async function load_data_from_text(text_snippet, data_date) {
  var services_location = [];
  var services_x = [];
  var services_y = [];
  var services_name = [];
  var services_appointments = [];
  var services_capacity = [];
  var services_metadata = [];

  var data = d3.csvParse(text_snippet);

  // Get column headers
  var extra_columns = Object.keys(data[0]);

  // Remove colleted columns
  extra_columns.splice(extra_columns.indexOf("location",),1);
  extra_columns.splice(extra_columns.indexOf("name",),1);
  extra_columns.splice(extra_columns.indexOf("appointments",),1);
  extra_columns.splice(extra_columns.indexOf("capacity",),1);

  // Save data
  for (let i = 0; i < data.length; i++) {
    services_location.push(data[i].location);
    services_name.push(data[i].name);
    services_appointments.push(data[i].appointments);
    services_capacity.push(data[i].capacity);

    // metadata saving
    var extra_data = [];
    for (let j = 0; j < extra_columns.length; j++) {
      extra_data.push([extra_columns[j], data[i][extra_columns[j]]]);
    };
    services_metadata.push(extra_data);

    // Get co-ordinates
    var api_address = ("http://api.postcodes.io/postcodes/").concat(services_location[i].replace(/\s/g, ''));
    var api_data = await get_coords(api_address);
    services_x.push(api_data.result.latitude);
    services_y.push(api_data.result.longitude);
  };

  return {
           "date": data_date,
           "location": services_location,
           "x": services_x,
           "y": services_y,
           "name": services_name,
           "appointments": services_appointments,
           "capacity": services_capacity,
           "metadata": services_metadata
         };
};
