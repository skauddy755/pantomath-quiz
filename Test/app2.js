var express = require("express");
var app = express();
var mongoose  = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/quiz_show", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json);
//app.set("view engine", "ejs");

app.get("/:n", function(req, res){
    var n = req.params.n;
    res.render("loop2.ejs", {index:n});
});

app.post("/:n", function(req, res){
    var n = req.params.n;
    console.log(req);
    res.render("loop.ejs", {index: 404});
});

app.get("/log/:n", function(req, res){
    var n = req.params.n;
    console.log(n);
    console.log(req);
    res.redirect("/53");
});

app.listen(3000, function(){
    console.log("Server is running at PORT: 3000 ...");
});