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

    indexRoutes     	= require("./index");
    userRoutes          = require("./user");
    mychallengesRoutes  = require("./myposts");

    middlewareObj 		= require("../middleware/index");
console.log(middlewareObj);
//===============================================================
var router = express.Router({mergeParams: true});
//===============================================================
//-------------------VIEW MY_POSTS-----------------------------
router.get("/:userId/myposts", middlewareObj.isLoggedIn, middlewareObj.checkOwnership, function(req, res){
    Question.find({},function(err, all){
        let i;
        var posts = [];
        for(i=0; i<all.length; i++)
        {
            var id = all[i].author.id;
            if(id.equals(req.params.userId))
            {
                posts.push(all[i]);
            }
        }
        
        console.log(posts);
        User.findById(req.params.userId, function(err, item){
            res.render("myposts.ejs", {user: item, posts:posts});
        });
    });
});
router.get("/:userId/myposts/new", middlewareObj.isLoggedIn, middlewareObj.checkOwnership, function(req, res){
    User.findById(req.params.userId, function(err, item){
        res.render("new_myposts.ejs", {user:item});
    });
});
router.post("/:userId/myposts", middlewareObj.isLoggedIn, middlewareObj.checkOwnership, function(req, res){
    console.log("We received your QUESTION request...");
    console.log(req.body.question);
    Question.create(req.body.question, function(err, ques){
        if(err){
            console.log(err);
            res.redirect("/"+req.params.userId+"/myposts/new");
        }
        else{
            ques.author.id = req.user._id,
            ques.author.username = req.user.username;
            ques.save();

            res.redirect("/"+req.params.userId+"/myposts");
        }
    });

});
//---------------------------------------------------------------
//==============EDIT POST========================================
router.get("/:userId/:postId/edit", middlewareObj.isLoggedIn, middlewareObj.checkOwnership, function(req, res){
    Question.findById(req.params.postId, function(err, item){
        if(err) console.log("ERROR in finding the POST during EDITING...");
        else{
            res.render("edit_myposts.ejs", {postId: req.params.postId, post:item});
        }
    });
});
router.put("/:userId/:postId/edit", middlewareObj.isLoggedIn, middlewareObj.checkOwnership, function(req, res){
    Question.findByIdAndUpdate(req.params.postId, req.body.question, function(err, item){
        if(err){
            console.log("ERROR in EDITING the POST...\n"+err);
            res.redirect("/"+req.params.userId+"/"+req.params.postId+"/edit");
        }
        else{
            res.redirect("/"+req.params.userId+"/myposts");
        }
    });
});
//=================DELETE POST===================================
router.delete("/:userId/:postId/destroy", middlewareObj.isLoggedIn, middlewareObj.checkOwnership, function(req, res){
    Question.findByIdAndRemove(req.params.postId, function(err, item){
        if(err) console.log("ERROR in DELETING the POST...");
        else{
            res.redirect("/"+req.params.userId+"/myposts");
        }
    });
});
//---------------------------------------------------------------
//+++++++++++++++++++++  MIDDLEWARE  +++++++++++++++++++++++++++++++++++++++++++++++
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) next();
	else
		res.redirect("/login");
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;