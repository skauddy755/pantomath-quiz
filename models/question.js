var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    statement: String,
    A: String,
    B: String,
    C: String,
    D: String,
    correctOpt: {type:String, enum: ["A","B","C","D"]},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Question",questionSchema);