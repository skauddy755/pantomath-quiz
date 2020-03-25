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

	userRoutes 			= require("./user");
	mypostsRoutes   	= require("./myposts");
	mychallengesRoutes  = require("./myposts");
	//commentRoutes		= require("./routes/comments");
	//campgroundRoutes 	= require("./routes/campgrounds");
	//indexRoutes 		= require("./routes/index");
	//middlewareObj 		= require("../middleware/index");

//===============================================================
var router = express.Router({mergeParams: true});
//===============================================================

router.get("/", function(req, res){
	res.redirect("/home");
});

router.get("/home", function(req, res){
	res.render("index.ejs");
});

router.get("/users", function(req, res){
	User.find({}, function(err, items){
		if(err) console.log("ERROR in Finding all users array...");
		else{
			res.render("users.ejs", {items: items});
		}
	});
});
//--------------------------------------------------------------------
router.get("/register", function(req, res){
	res.render("signup.ejs");
});

router.post("/register", function(req, res){
	//res.send("Got New user");
	console.log(req.body);
	
	var nu = new User({
		username: req.body.username,
		contact: req.body.contact,
		rating: 0
	});
	User.register(nu, req.body.password, function(err, item){
		if(err)
		{
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			console.log(item);
			var userId = item._id;
			req.flash("success", "Successfully signed you in...!!");
			res.redirect("/dashboard/"+userId);
		});
	});
});
//--------------------------------------------------------------------------
router.get("/login", function(req, res){
	res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/login"
}) , function(req, res){
	console.log("Okay..Logged in ...!!");
});
//---------------------------------------------------------------------------
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully Logged you out...!!!");
	res.redirect("/home");
});
//------------------------------------------------------------------------

//+++++++++++++++++++++  MIDDLEWARE  +++++++++++++++++++++++++++++++++++++++++++++++
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) next();
	else
		res.redirect("/login");
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;