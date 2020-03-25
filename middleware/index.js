var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash"),

    User 			= require("../models/user"),
    Question 		= require("../models/question"),
    Challenge 		= require("../models/challenge"),
	seedDB 			= require("../seeds");

	indexRoutes 		= require("../routes/index");
	userRoutes 			= require("../routes/user");
	mypostsRoutes   	= require("../routes/myposts");
    mychallengesRoutes 	= require("../routes/mychallenges");
    
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        req.flash("success", "Successfully Reached the dashboard...!!!");
        next();
    }
    else
    {
        req.flash("error", "You need to be signed-in to do that...!!!");
        res.redirect("/login");   
    }
}

middlewareObj.checkOwnership = function(req, res, next)
{
    if(req.params.userId == req.user._id)
    {
        next();
    }
    else
    {
        req.flash("error", "You don't have permission to do that...!!!");
        req.flash("success", "");
        res.redirect("/home");
    }
}

module.exports = middlewareObj;