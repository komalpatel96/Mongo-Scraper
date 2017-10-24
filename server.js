// Dependencies
var express = require("express");
var path = require('path');

var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Initialize Express
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// var routes = require("./routes/routes.js");

// app.use("/", routes);

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.post("/fetch", function(req, res) {

  // Make a request call to grab the HTML body from the site of your choice
  request("https://www.cnn.com/us", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    var results = [];
    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("h3.cd__headline").each(function(i, element) {

      var link = $(element).children().attr("href");
      var title = $(element).children().text();

      // console.log("headline: ", element);

      results.insert({
        "title": title,
        "link": link
      });

      // response.json(db.scrape);
    });

    db.scrape.insertMany(results);
  });

});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?
app.get("/all", function(req, res) {

      db.scrape.find({}, function(err, data) {
        // Log any errors if the server encounters one
        if (err) {
          console.log(err);
        }
        // Otherwise, send the result of this query to the browser
        else {
          res.json(data);
        }
      });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
