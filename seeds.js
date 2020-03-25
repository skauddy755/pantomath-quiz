var mongoose  = require("mongoose");

    User      = require("./models/user"),
    Question  = require("./models/question"),
    Challenge = require("./models/challenge");


mongoose.connect("mongodb://localhost/quiz_show",{useUnifiedTopology:true, useNewUrlParser:true});

function deleteAllUsers()
{
    User.remove({});
}

function deleteAllQuestions()
{
    Question.remove({});
}

function deleteAllChallenges()
{
    Challenge.remove({});
}

function addUsers(n)
{
    console.log("SEEDING "+n+" USERS into the DB");
    for(let i=0; i<n; i++)
    {
        let obj = new User({
            username: "Master"+i,
            contact: 8340393937,
            rating: 0,
        });
        let password = i;
        User.register(obj, password, function(err, item){
            if(err)console.log("Some ERROR occured in SEEDING Master:"+i);
            else console.log(item);
        });
    }
}
function addQuestions()
{
    
}