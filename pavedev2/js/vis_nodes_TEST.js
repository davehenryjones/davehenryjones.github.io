// Load data from csv to create nodes

// Call from index.js with services_nodes = load_vis_nodes_api();
export function load_vis_nodes_api(svg,grid_ref) {
    var services_location = [];
    var services_x = []];
    var services_y = [];
    var services_name = [];
    var services_appointments = [];
    // Loads data from csv
    d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/services_list.csv", function(data) {
        for (let i = 0; i < data.length; i++) {
            services_location.push(data[i].location);
            services_name.push(data[i].name);
            services_appointments.push(data[i].appointments);
        };
    });
    // WAIT A FEW SECONDS
    setTimeout(function() {
        // For all services
        for (let i = 0; i < services_location.length; i++) {
            //  Get rid of whitespace in postcode
            var postcode_no_whitespace = "";
            postcode_no_whitespace = services_location[i].replace(/ /g, '')
            //  Call API with postcode_no_whitespace
            var api = "http://api.postcodes.io/postcodes";
            var api_address = api.concat(postcode_no_whitespace);

            // request data from API
            request.open('GET', api_address, true)
            request.onload = function () {
                // Begin accessing JSON data here
                var data = JSON.parse(this.response)
                // Get x and y coordinates from API, append to services
                if (request.status >= 200 && request.status < 400) {
                    services_x.push(data.result.latitude);
                    services_y.push(data.result.longitude);

                } else {
                    console.log('error')
                }
            }, 3000);
        }

    };
    return [services_location, services_x, services_y, services_name, services_appointments];
};