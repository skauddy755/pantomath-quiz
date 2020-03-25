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

    indexRoutes 	= require("./index"),
    userRoutes      = require("./user"),
	mypostsRoutes   = require("./myposts"),
	
	middlewareObj 	= require("../middleware/index");
console.log(middlewareObj);    
//===============================================================
var router = express.Router({mergeParams: true});
//===============================================================
router.get("/:userId/mychallenges", function(req, res){// -----------------------View all challenges of :userId ...
	Challenge.find({}, function(err, all){
		let i;
		let comp = [];
		let outgoing = [];
		let incoming = [];
		for(i=0; i<all.length; i++)
		{
			if(all[i].status == 1)
			{
				let id1 = all[i].by;
				let id2 = all[i].against;
				let id = req.params.userId;
				if((id==id1)||(id==id2))
					comp.push(all[i]);
			}
				
			else if(all[i].status == 0){
				let id1 = all[i].by;
				let id2 = all[i].against;
				let id = req.params.userId;
				if(id1==id)
					outgoing.push(all[i]);
				else if(id2==id)
					incoming.push(all[i]);
			}
		}
		res.render("mychallenges.ejs", {comp:comp, outgoing:outgoing, incoming:incoming});
	});
});
//====================================== NEW CHALLENGE =========================================
router.get("/:userId/mychallenges/new", function(req, res){//----------------------------render the form to select opponent ...
	User.find({}, function(err, items){
		if(err) console.log("ERROR in Finding all Users... in new challenge...");
		else{
			res.render("new_mychallenges.ejs", {users: items});
		}
	});
});
router.get("/:userId/mychallenges/:newUserId", function(req, res){//--------------show the 'VERSUS PAGE' containing "CONTINUE" to Hotseat button
	User.findById(req.params.userId, function(err, by){
		User.findById(req.params.newUserId, function(err, against){
			res.render("continue_new_mychallenges.ejs", {by:by, against:against});
		});
	});
});
//----------------------------------------------------------------
router.get("/:userId/mychallenges/:newUserId/carryout", function(req, res){
	Question.find({}, function(err, arr){
		console.log(arr);
		let obj = new Challenge({
			by: req.params.userId,
			against: req.params.newUserId,
			scoreBy: [],
    		scoreAgainst: [],
    		status: -1
		});
		User.findById(req.params.userId, function(err, item){
			obj.byName = item.username;
			User.findById(req.params.newUserId, function(err, item){
				obj.againstName = item.username;

				obj.ques = [];
				let indices = uniqueRandom(arr.length, 5);
				for(let i=0; i<5; i++)
				{
					obj.ques.push(arr[indices[i]]);
				}
				//res.send(indices);
				obj.save();
				console.log(obj);
				res.redirect("/hotseat/"+obj._id+"/"+req.params.userId+"/0");
				//res.redirect("/"+userId+"/mychallenges/"+newUserId+"/carryout/0");
			});
		});
	});
});
//=================================== INCOMPLETE INCOMING CHALLENGE ==============================================
router.get("/:userId/mychallenges/existing/:challengeId", function(req, res){//--------------show the 'VERSUS PAGE' containing "CONTINUE" to Hotseat button
	Challenge.findById(req.params.challengeId, function(err, ch){
		User.findById(ch.by, function(err, by){
			User.findById(ch.against, function(err, against){
				res.render("continue_existing_mychallenges.ejs", {by:by, against:against, ch:ch});
			});
		});
	});
});
//--------------------------------------------------------------------------------
router.get("/:userId/mychallenges/existing/:challengeId/carryout", function(req, res){
	res.redirect("/hotseat/"+req.params.challengeId+"/"+req.params.userId+"/0");
});
//=================================================================================================================================
//====================== ( Routes similar to : ---> app3.js of Test )=> [...although not exactly]==================================

router.get("/hotseat/:challengeId/:currentUserId/:quesIndex", function(req, res){ //----------------------- "/:n" GET-route
	console.log("ROUTED TO INDEX.........."+req.params.quesIndex);
	Challenge.findById(req.params.challengeId).populate("ques").exec(function(err, item){
		let n = req.params.quesIndex;
		console.log(n+"================/:n==========================================\n"+item.ques[n]);
		console.log(".....WILL RENDER HOTSEAT....."+req.params.quesIndex);
		res.render("hotseat.ejs", {
			challengeId: req.params.challengeId,
			currentUserId: req.params.currentUserId,
			quesIndex: req.params.quesIndex,
			ques: item.ques[n],
			n:n
		});
		res.end();
	});
});
router.get("/hotseat/:challengeId/:currentUserId/:quesIndex/:ans", function(req, res){ //--------------- "/:n/:word" (GET-route)
	//Okay stop that now...!!
	console.log("..........ROUTED TO ANSWER.........."+req.params.quesIndex);
    Challenge.findById(req.params.challengeId).populate("ques").exec(function(err, item){
		console.log(req.params.quesIndex+": ANSWER = "+req.params.ans+",   CorrectOption = "+item.ques[req.params.quesIndex].correctOpt);
		var flag = (item.ques[req.params.quesIndex].correctOpt == req.params.ans);

		if(req.params.currentUserId==item.by){
			var value = (flag==true)? 1 : 0; //console.log(typeof value);console.log(item.scoreBy);
			item.scoreBy.push(value);//console.log(item.scoreBy);
			//item.save();
		}
		else {
			//item.scoreAgainst[req.params.quesIndex] = (flag==true)? 1 : 0;
			var value = (flag==true)? 1 : 0;
			item.scoreAgainst.push(value);
			//item.save();
		}

		//...............Time for next question................
		if(req.params.quesIndex<(5-1)){
			item.save();
			let c = req.params.challengeId;
			let u = req.params.currentUserId;
			let n = req.params.quesIndex;
			let m  = (n*1) + 1;
			console.log(".....WILL ROUTE TO INDEX (N+1)"+req.params.quesIndex);
			res.redirect("/hotseat/"+c+"/"+u+"/"+m);
		}
		else{
			//res.redirect("/"+req.params.userId+"/mychallenges");
			/*res.render("record_mychallenges.ejs", {
				challenge:item,
				currentUserId: req.params.currentUserId,
			});*/
			//res.send("Okay... that's all !!!");
			item.status = item.status + 1;
			item.save();
			console.log("STATUS       = "+item.status);
			console.log("scoreBy      = "+item.scoreBy);
			console.log("scoreAgainst = "+item.scoreAgainst);
			setValues(item, req.params.currentUserId);
			res.render("result.ejs", {item:item});
		}
	});
});
//-----Function to evaluate score and to set rating...
function setValues(item, cuid)
{
	var flag = (item.by==cuid) ? 1 : 2; //flag = (1,2) --> (by, against)
	if(item.status==1) // i.e., both the players have completed the challenge...
	{
		let _scoreBy = 0;
		let _scoreAgainst = 0;
		for(let i=0; i<5; i++)
		{
			_scoreBy += 1*item.scoreBy[i];
			_scoreAgainst += 1*item.scoreAgainst[i];
		}
		console.log(_scoreBy+" , "+_scoreAgainst);
		//Assuming (+ve) wrt to against...
		let difScore  = _scoreAgainst - _scoreBy;
		User.findById(item.by, function(err, by){
			User.findById(item.against, function(err, against){
				let difRating = by.rating - against.rating;

				against.rating = against.rating + difScore + difRating;
				by.rating = by.rating - difScore - difRating;

				against.save();
				by.save();
				console.log(by.rating);
				console.log(against.rating);
				//res.render("result.ejs", {item:item});
			});
		});

	}
}
//-----------
//=======================================================================================================================
router.post("/:userId/mychallenges", function(req, res){ //TO BE REQUESTED WHEN ALL THE QUESTIONS ARE ANSWERED...
	res.send("Okay we received your challenge request...");
	console.log(req.body);
});
//---------------------------------------------------------------
//++++++++++++++++++++++++++++++++++++  MIDDLEWARE  +++++++++++++++++++++++++++++++++++++++++++++++
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) next();
	else
		res.redirect("/login");
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
//=======================HELPING FXNS =====================================================
function uniqueRandom(length, N)
{
    let indices = [];
    let counter = 0;
    while(counter<N)
    {
        var x = Math.floor(length * Math.random());
        //console.log(x);
        var flag = true;
        for(let j=0; j<counter; j++)
        {
            if(indices[j]==x)flag=false;
        }
        if(flag==false)continue;
        indices.push(x);
        counter++;    
    }
    //console.log(indices);
    return indices;
}