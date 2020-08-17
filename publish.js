const ghpages = require("gh-pages");

ghpages.publish("dist", function(err) {
  console.log("Publishing frontend to GitHub Pages...");
});
