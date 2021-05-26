const express = require('express')
const router = express.Router()
const User = require('.././models/user.model')
const Team = require('.././models/room.model')
const {retrieveRandomSong, retrieveSpecificSong} = require("../generateSongs.js")

router.route('/randomSong').post((req,res) => {
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
router.route('/previousSong').post((req,res) => {
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