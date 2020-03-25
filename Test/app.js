var express = require("express");
var app = express();
var mongoose  = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/quiz_show", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//app.use(express.static("public/q2.jpg"));

//+++++++++++++++++++++++++++++++++++++++++++++++++++
var t;
//===================================================
app.get("/:n", function(req, res){
    console.log("GET req at /n "+req.params.n);
    res.render("loop", {index: req.params.n});
    res.end();
    t = setTimeout(function(){
        console.log("Times up Dude...!!!");
        res.redirect("/b/"+req.params.n);
    }, 5000);
});
//===================================================
app.post("/:n", function(req, res){

    console.log("POST req at /n "+req.params.n);
    clearTimeout(t);
    var word = req.body.word;
    console.log(word);

    res.redirect("/b/"+req.params.n);
});
//===================================================
app.get("/b/:n", function(req, res){
    console.log("GET req at /b/n "+req.params.n);
    //clearTimeout(t);
    var n = req.params.n;
    n++;
    res.redirect("/"+n);
});

//===================================================
app.listen(3000, "localhost", function(){
    console.log("Server is running at PORT:3000");
});