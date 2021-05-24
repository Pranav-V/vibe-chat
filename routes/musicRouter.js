const express = require('express')
const router = express.Router()
const User = require('.././models/user.model')
const {retrieveRandomSong, retrieveSpecificSong} = require("../generateSongs.js")

router.route('/randomSong').post((req,res) => {
    const name = req.body.name
    const room = req.body.room
    const song = retrieveRandomSong(name,room)
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

module.exports = router