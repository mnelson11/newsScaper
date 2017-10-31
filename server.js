
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;


var app = express();



//request call for clickhole news

request("http://www.clickhole.com/features/news/", function(error, response, html){

  if(error){
    console.log(error);
  }else {


      //load HTML into cheerio
      var $ = cheerio.load(html);


    // Database configuration
    var databaseUrl = "scraper";
    var collections = ["scrapedData"];


      //array to saved scraped data
      var numArticles = 0;
      var scrapeResults = [];

      //use cheerio to find each article
      $("h2.headline > a").each(function(i, element){
          var title = $(element).text();
          var url = $(element).attr("href");
     
          

          //create object to hold each article info

          var articleData = {
            "index":i,
            "title":title,
            "url":url,
          };

          scrapeResults.push(articleData);

    });
    // Hook mongojs configuration to the db variable
    var db = mongojs(databaseUrl, collections);
      db.on("error", function(error) {
     console.log("Database Error:", error);
  });

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send(scrapeResults);
});

    console.log(scrapeResults);
  }
});
