const express = require('express')
const router = express.Router()
const Room = require("../models/room.model")
var User = require("../models/user.model")
var Chance = require('chance')
const chance = new Chance()
//router for authentication and room creation
router.route('/createRoom').post((req,res) => {
    //create a room along with a new user. check to see if the user name dne admin
    const name = req.body.name
    if(name=="admin")
    {
        res.json({success:false, message:"Please choose a different name."})
        return
    }
    const room = chance.integer({min:1000, max:100000})
    const img = chance.integer({min:0,max:49})
    const newUser = new User({name,room,img,prevSongs: [], currentPosition: -1})
    newUser.save()
        .then(() => {
            const newRoom = new Room({
                turn: 0,
                members: [name],
                room, 
                lSongs: []
            })
            newRoom.save()
                .then(() => res.json({success:true, room: room, img: img}))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})

router.route('/getMemberData').post((req,res) => {
    //get the data for each user in a Room
    const room = req.body.room
   User.find({room:room})
        .then(info => {
            const data = info.map((element) => {
                return [element.name,element.img]
            })
            console.log(data)
            res.json(data)
        })
        .catch(err => res.json(err))
})

router.route('/joinRoom').post((req,res) => {
    //join a room by looking through Room object and validating the requirements
    const name = req.body.name
    const room = req.body.room
    const img = chance.integer({min:0,max:49})
    console.log("here")
    Room.find({room:room})
        .then(info => {
            if(name=="admin")
            {
                res.json({success:false, message: "Please choose a different name."})
            }
            if(info.length==0)
            {
                console.log('here')
                res.json({success: false, message: "Room does not exist."})
                return
            }
            console.log('works')
            const data = info[0]
            if(data.members.length >=6)
            {
                res.json({success:false, message: "This room has reached its maximum occupancy."})
                return
            }
            if(data.members.includes(name))
            {
                res.json({success:false, message: "Please choose a different name. Your name is already being used in the room."})
                return
            }
            const newUser = new User({name,room,img,prevSongs: [],currentPosition:-1})
            newUser.save()
                .then(() => {
                    console.log("here")
                    data.members = [...data.members,name]
                    console.log(data.members)
                    data.save()
                        .then(() => res.json({success:true, message: "You have been added to the room.", room: room, img: img}))
                        .catch(err => res.json(err))
                })
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))    
})

module.exports = router