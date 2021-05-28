const express = require('express')
const router = express.Router()
const User = require('.././models/user.model')
const Team = require('.././models/room.model')
const {retrieveRandomSong, retrieveSpecificSong,retrieveSongById} = require("../generateSongs.js")
//Routes for All Music Requests
router.route('/randomSong').post((req,res) => {
    //use imported method - retrieveRandomSong - to find song and save it to database
    const name = req.body.name
    const room = req.body.room
    const song = retrieveRandomSong(name,room)
    Team.find({room})
        .then(info => {
            const data = info[0].lSongs
            var songCheck = false
            data.forEach(element => {
                if(element[0] == song)
                {
                    songCheck = true
                }
            })
            if(!songCheck)
            {
                console.log(info[0])
                const newData = [...info[0].lSongs,[song,0]]
                info[0].lSongs = newData
                info[0].save()
            }
        })
        .catch(err => console.log(err))
    res.json(song)
})
router.route('/nextSong').post((req,res) => {
    //move pointer for the respective user
    const name = req.body.name
    const room = req.body.room

    User.find({name,room})
        .then(info => {
            const mData = info[0].prevSongs
            const cPos = info[0].currentPosition
            var retSong = []
            if(cPos<mData.length-1)
            {
                retSong = retrieveSpecificSong(mData[cPos+1])
                info[0].currentPosition = cPos + 1
                info[0].save()
                    .then(() => {
                        res.json(retSong)
                        return
                    })
                    .catch(err => res.json(err))
            }
            else
            {
                const song = retrieveRandomSong(name,room)
                Team.find({room})
                    .then(info => {
                        const data = info[0].lSongs
                        var songCheck = false
                        data.forEach(element => {
                            if(element[0] == song)
                            {
                                songCheck = true
                            }
                        })
                        if(!songCheck)
                        {
                            console.log(info[0])
                            const newData = [...info[0].lSongs,[song,0]]
                            info[0].lSongs = newData
                            info[0].save()
                        }
                    })
                    .catch(err => console.log(err))
                res.json(song)
            }

        })
})
router.route('/nextSpecificSong').post((req,res) => {
    //move to the next song, as specified by the request id
    const name = req.body.name
    const room = req.body.room
    const id = req.body.id

    const songs = retrieveSongById()
    let specific
    songs.forEach(element => {
        if(element.id==id)
        {
            specific = element
        }
    })
    var reminder = true
    User.find({name,room})
        .then(info => {
            const cuser = info[0]
            cuser.prevSongs.forEach(element => {
                if(element == songs.indexOf(specific))
                {
                    cuser.currentPosition = cuser.prevSongs.indexOf(element)
                    reminder = false
                    cuser.save()
                        .then(() => {
                            res.json({success:false,index:cuser.prevSongs.indexOf(element),song:specific})
                            return
                        })
                        .catch(err => console.log(err))
                    
                }
            })
            if(reminder)
            {
                console.log("how the hell am i here")
                const narray = [...cuser.prevSongs, songs.indexOf(specific)]
                cuser.prevSongs = narray
                cuser.currentPosition = narray.length-1
                cuser.save()
                    .then(() => res.json({success:true,song:specific}))
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
    
})
router.route('/previousSong').post((req,res) => {
    //move the pointer back in the User schema
    const name  = req.body.name
    const room = req.body.room

    User.find({name,room})
        .then(info => {
            const mData = info[0].prevSongs
            if(mData.length<=1 || info[0].currentPosition<=0)
            {
                res.json({"success":false})
                return
            }
            const song = retrieveSpecificSong(mData[info[0].currentPosition-1])
            info[0].currentPosition = info[0].currentPosition - 1
            info[0].save()
                .then(() => res.json({"success":true,"song_data":song}))
                .catch(err => res.json(err))
         })
         .catch(err => res.json(err))

})

router.route("/changeLike").post((req,res) => {
    //change the Like ranking by updating the respective Room object
    const songData = req.body.song
    const room = req.body.room
    const dir = req.body.dir
    Team.find({room})
        .then(info => {
            const data = info[0].lSongs
            data.forEach(element => {
                if(JSON.stringify(element[0])==JSON.stringify(songData))
                {
                    const number = dir=="+"?1:-1
                    const newPoint = [element[0],element[1]+number]
                    const index = data.indexOf(element)
                    console.log(index)
                    var newSet = [...data]
                    if(newSet.length>1)
                    {
                        newSet.splice(index,1)
                    }
                    else
                    {
                        newSet = []
                    }
                    console.log(newSet)
                    console.log("------")
                    const retSet = [...newSet,newPoint]
                    console.log(retSet)
                    info[0].lSongs = retSet
                    info[0].markModified('lSongs');

                    info[0].save()
                        .then(() => res.json({"success":false}))
                        .catch(err => res.json(err))
                }
            })

        })
        .catch(err => res.json(err))
})

module.exports = router