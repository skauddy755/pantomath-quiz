var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash"),

    User 			= require("./models/user"),
    Question 		= require("./models/question"),
    Challenge 		= require("./models/challenge"),
	seedDB 			= require("./seeds");

	indexRoutes 		= require("./routes/index");
	userRoutes 			= require("./routes/user");
	mypostsRoutes   	= require("./routes/myposts");
	mychallengesRoutes 	= require("./routes/mychallenges");

//seedDB();
////console.log(__dirname);

//mongoose.connect("mongodb://localhost/quiz_show",{useUnifiedTopology:true, useNewUrlParser:true});
mongoose.connect("mongodb+srv://SandAuddy755:ska755dog@cluster0-ywgza.mongodb.net/test?retryWrites=true&w=majority",{
	useUnifiedTopology:true,
	useNewUrlParser:true
});

var app = express();

app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser:true}));
app.use(methodOverride("_method"));
app.use(flash());

//=====================================================
//-----------PASSPORT CONFIG.--------------------------
app.use(require("express-session")({
	secret: "Rusty is still the cutest DOG...",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

//=====================================================

app.use(indexRoutes);
app.use(userRoutes);
app.use(mypostsRoutes);
app.use(mychallengesRoutes);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server is running at PORT: 3000 ...");
});