const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    room: {type: String, required: true}, 
    user: {type: String, required: true}, 
    message: {type: String, required: true},
    img: {type:Number, required: true}
},
{
    timestamps: true
})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat