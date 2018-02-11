var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// var routes = require("./controllers/controller.js");


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");

//HANDLEBARS
app.engine("handlebars", exphbs({
  title: "PAGE TITLE",
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/NYTScraper", {
//   useMongoClient: true
// });

//------------DATABASE CONFIGURATION WITH MONGOOSE---------------------
var databaseUri = "mongodb://localhost/NYTScraper";
mongoose.Promise = Promise;



if (process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
  } 


// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYTScraper";

// mongoose.connect(MONGODB_URI, {
//   useMongoClient:true
// });

//----------------------END OF CONFIGURATION------------
// var db = mongoose.connection;

// //show any mongoose errors
// db.on("error", function(err){
//   console.log("Mongoose error: ", err);
// });

// db.once("open", function(err){
//   console.log("Mongoose connection successfull.");
// });


//ROUTES
require("./routes/routes.js")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});