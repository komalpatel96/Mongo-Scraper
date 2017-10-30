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
app.get("/", function(req, res) {
  db.Article.find({}, function(err, data) {
    console.log(data);
    if (err) {
      console.log(err);
    } else {
      // res.json(data);
      res.render("index", {
        article: data
      });
    }
  });
});

// Routes
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.story-heading").each(function(i, element) {
      // Save an empty result object
      console.log(element);
      var result = {};
      // console.log(result); //empty {}
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children("a.story-link")
        .children("div.story-meta")
        .children("p.summary")
        .text();
      result.saved = false;

      // Create a new Article using the `result` object built from scraping
      db.Article
        .insertMany(result)
        .then(function(dbArticle) {
          console.log(result);
          // If we were able to successfully scrape and save an Article, send a message to the client
          console.log("Scrape Complete!");
          // console.log(dbArticle);

          res.send("Scrape Complete");

        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
    res.redirect("/");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}, function(err, data) {
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

//SAVE Article
app.post("/saved/:id", function(req, res) {

  // var articleId = `ObjectId("${req.params.id}")`;

  var articleId = req.params.id
  console.log("trying to save article");

  db.Article.find({
      _id: articleId
    })
    .then(function(newNote) {
      // console.log("inside the create function");
      //log errors
      console.log("inside the else findOneAndUpdate");

      db.Article.findOneAndUpdate({
          _id: articleId
        }, {
          $set: {
            saved: true
          }
        }, {
          new: true
        })
        .then(function(data) {
          console.log("changed saved to true!!!")
          res.render(data);
        })
    })

});

//Grabs all "SAVED: TRUE" articles
app.get("/saved", function(req, res) {
  // Grab every dbArticle in the Articles array
  var id = req.params.id;
  db.Article.find({
    "saved": true
  }, function(error, dbArticle) {
    // Log errors
    if (error) {
      console.log(error // Or send the dbArticle to the browser as a json object
      );
    } else {
      res.render("saved", {
        article: dbArticle
      });
    }
  });
});


// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {

  var articleId = req.params.id;

  console.log(req.body);
  db.Note
    .create(req.body)
    // Specify that we want to populate the retrieved libraries with any associated books
    .then(function(newNote) {
      // If any Libraries are found, send them to the client with any associated Books
      return db.Article.update({
        _id: articleId
      }, { //push is only for an array
        $push: {
          note: newNote._id
        }
      }, {
        new: true
      }).then(function(dbArticle) {
        res.json(dbArticle);

      });
    })
});

app.get("/notes/:id", function(req, res) {
  var reqId = req.params.id;

  console.log(articleId);

  db.Note
    .find({
      "articleId": reqId
    })
    .then(function(dbNote) {

      for (var i = 0; i < dbNote.length; i++) {
        console.log(dbNote[i]);
      }
    })
    .then(function(newNotes) {
      // If an error occurs, send it back to the client
      console.log(newNotes)
    });
});


app.get("/savednotes/:id", function(req, res) {
  var articleId = req.params.id;

  console.log(articleId);

  db.Article
    .find({
      "articleId": req.params.id
    })
    .then(function(dbNote) {

      for (var i = 0; i < dbNote.length; i++) {
        console.log(dbNote[i]);
      }
    })
    .then(function(newNotes) {
      // If an error occurs, send it back to the client
      console.log(newNotes)
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

  db.Article
    .find({
      "_id": req.params.id
    })
    // Specify that we want to populate the retrieved libraries with any associated books
    .populate("note")
    .then(function(dbNote) {
      // If any Libraries are found, send them to the client with any associated Books
      console.log(dbNote);
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

//DELETE-ING ARTICLE
app.post("/api/delete/:id", function(req, res) {

  console.log("Trying to delete this article ID:");
  console.log(req.params.id);

  console.log("Got into delete function");
  db.Article.find({
    _id: req.params.id
  }).then(function(dbArticle) {
    console.log(dbArticle);

    db.Article.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        saved: false
      }
    }, {
      new: true
    }).then(function(result) {
      console.log("delete function result-------")

      console.log(result);
      res.json(result);
    });

    res.redirect("/saved");
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});