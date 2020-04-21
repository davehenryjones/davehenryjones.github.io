// Load data from csv to create edges
export function load_vis_edges(svg, grid_ref) {
  var x1s = [];
  var y1s = [];
  var x2s = [];
  var y2s = [];
  var ts = [];

  var promise = new Promise (function (resolve, reject) {
    //return d3.csv("/resources/referrals_list_combined.csv", function(data) {
    return d3.csv("https://raw.githubusercontent.com/davehenryjones/WellbeingJam2020/dev/src/public/resources/referrals_list_combined.csv", function(data) {
      for (let i = 0; i < data.length; i++) {
        x1s.push(grid_ref[data[i].source][0]);
        y1s.push(grid_ref[data[i].source][1]);
        x2s.push(grid_ref[data[i].dest][0]);
        y2s.push(grid_ref[data[i].dest][1]);
        ts.push(data[i].referrals / 100);
      };
      resolve();
    });
  });

  promise
    .then(function() {
      for (let i = 0; i < x1s.length; i++) {
        var polyline = L.polyline([[x1s[i], y1s[i]],[x2s[i], y2s[i]]], {
          color: '#00ffff',
          opacity: 0.8,
          weight: ts[i] / 5
        }).addTo(svg);
      };
    })
    .catch(function() {
      console.log("Error Loading Edges");
    });

    return [x1s, y1s, x2s, y2s, ts];
};
