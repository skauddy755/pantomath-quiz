var mongoose = require("mongoose");

var challengeSchema = new mongoose.Schema({
    
    by: String,//ids
    against: String,//ids
    byName: String,//username
    againstName: String,//username
    ques: [
        {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question"
		}
    ],
    scoreBy: [Number],
    scoreAgainst: [Number],
    status: Number

});

module.exports = mongoose.model("Challenge", challengeSchema);