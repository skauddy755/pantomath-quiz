var express = require("express");
var app = express();
var mongoose  = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/quiz_show", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
//app.set("view engine", "ejs");
//app.use(express.static("public/q2.jpg"));

//+++++++++++++++++++++++++++++++++++++++++++++++++++
//var t;
//===================================================
app.get("/:n", function(req, res){
    console.log("GET req at /n "+req.params.n);
    res.render("loop3.ejs", {index: req.params.n});
    res.end();
});
//===================================================
app.get("/:n/:word", function(req, res){

    var n = req.params.n;
    var word = req.params.word;

    console.log("GET req at /n/word "+n);
    console.log(word);

    n++;
    res.redirect("/"+n);
});
//===================================================
app.post("/:n", function(req, res){

    var n = req.params.n;
    var word = req.body.word;

    console.log("POST req at /n "+n);
    console.log(word);

    res.redirect("/"+n+"/"+word);
});
//===================================================
app.listen(3000, "localhost", function(){
    console.log("Server is running at PORT:3000");
});