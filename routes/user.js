var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local");
	methodOverride 	= require("method-override");
	flash 			= require("connect-flash");

	User 			= require("../models/user");
	Question 		= require("../models/question");
    Challenge 		= require("../models/challenge");

    indexRoutes 	    = require("./index");
    mypostsRoutes       = require("./myposts");
	mychallengesRoutes  = require("./myposts");
	
	middlewareObj 		= require("../middleware/index");
    
//===============================================================
var router = express.Router({mergeParams: true});
//===============================================================
router.get("/dashboard",middlewareObj.isLoggedIn, function(req, res){
	var userId = req.user._id;
	res.redirect("/dashboard/"+userId);
});
router.get("/dashboard/:userId", middlewareObj.isLoggedIn, function(req,res){
	//res.send("Okay... This is your dashboard...");
    //res.render("dashboard", {userId:req.params.userId});
    User.findById(req.params.userId, function(err, item){
		console.log("USER OBJECT follows next...");
        console.log(item);
        res.render("dashboard", {user: item});
	});
});
//--------------------------------------------------------------

//+++++++++++++++++++++  MIDDLEWARE  +++++++++++++++++++++++++++++++++++++++++++++++
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) next();
	else
	{
		req.flash("error", "You need to signed-in in to do that...!!!");
		res.redirect("/login");
	}
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;