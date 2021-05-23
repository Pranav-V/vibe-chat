const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const userSchema = new Schema({
    name: {type: String, require: true},
    room: {type: String, required: true},
    img: {type: String, required: true}
}, 
{
    timestamps: true
})

const User = mongoose.model("user", userSchema)

module.exports = User