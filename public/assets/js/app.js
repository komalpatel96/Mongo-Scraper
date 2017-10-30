//On click SAVE btn--> SAVES ARTICLE
$(document).on("click", "#saveBtn", function() {
  var thisId = $(this).attr("data-id");
  
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId
  }).done(function(data) {
      // Log the response
      console.log(data);
    });
});

//On click DELETE btn --> DELETES ARTICLE
$(document).on("click", "#deleteBtn", function() {
  var thisId = $(this).attr("data-id");
  
  $.ajax({
    method: "POST",
    url: "api/delete/" + thisId
  }).done(function(data) {
      // Log the response
      console.log(data);
      location.reload();
    });
});

//On click NoteBtn btn --> DELETES NOTE
$(document).on("click", "#saveNote", function() {
  console.log("clicking the noteBtn in app.js");

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/savednotes/" + thisId,
    data: {
      _id: thisId
    }
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data[0]);
       //$("#notes").empty();
      
    });
});

// // When you click the saveNote button -->
// $(document).on("click", "#saveNote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       note: $("#bodyinput" + thisId).val(),
//       noteId: thisId,
//       titleinput: $("#titleinput" + thisId).val(),
//       bodyinput: $("#bodyinput" + thisId).val()

//     }
//   })
//     // With that done
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });


// });

// $(document).on("click", "#saveNote", function() {

// console.log($(this));

// var thisId = this.dataset.id;

//   $.ajax({
//     method: "GET",
//     url: "/savednotes/" + thisId,
//     data: {
//       _id: thisId
//     }
//   })
//     .done(function(data) {
//       // res.json(data);
//       console.log(data); 
//        // $("#notes").empty();

//     });


// });