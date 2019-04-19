// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// Initialize Express
const app = express();

// PORT for the server
const PORT = process.env.PORT || 3000;

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedinfo";

// Connecting to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log("Connected to MongoDB");
});

// Set up a static folder (public) for site to use
app.use(express.static("public"));

// Home Route
app.get("/", (req, res) => {
  db.Post
    .find({})
    .populate("comments")
    .then(dbPosts => {
      // res.json(dbPosts);
      res.render("home", { posts: dbPosts });
    })
});

// Scrape route
app.get("/scrape", (req, res) => {
  axios
    .get("https://therealnews.com/recent-content")
    .then(response => {
      // console.log(response.data);
      // res.send(response.data);
      const $ = cheerio.load(response.data);
      $("div.fl-post-grid-post").each(function (i, element) {
        let postTitle = $(element).find("h2").text();
        let postImage = $(element).find("img").attr("src");
        let postDate = $(element).find("span").text();
        let postLink = $(element).find("h2").find("a").attr("href");
        let postSummary = $(element).find("p").text();
        // console.log(postTitle);
        // console.log(postDate);
        // console.log(postLink);
        // console.log(postSummary);
        let postObj = {
          postTitle: postTitle,
          postImage: postImage,
          postDate: postDate,
          postLink: postLink,
          postSummary: postSummary
        };
        // console.log(postObj);

        // Creating records in MongoDB
        db.Post
          .create(postObj)
          .then(dbPost => console.log(dbPost))
          .catch(err => console.log(err));
      });
      res.redirect("/");
    });
});

// Posting comments route
app.post("/api/:postID/comments", (req, res) => {
  db.Comment
    .create({ commentBody: req.body.commentBody })
    .then(dbPost => {
      // res.json(dbPost);
      return db.Post.findOneAndUpdate({ _id: req.params.postID }, { $push: { comments: dbPost._id } }, { new: true })
    })
    .then(res.redirect("/"))
    .catch(err => res.json(err));
});

app.get('/delete/:commentID', (req, res)=>{
  db.Comment.findOneAndRemove({_id: req.params.commentID})
  .then((dbComment)=>{
      // res.json(dbComment);
      res.redirect("/");
  })
  .catch((err)=>{
      res.json(err);
  });
});

// Set the app to listen on port 3000
app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`);
});