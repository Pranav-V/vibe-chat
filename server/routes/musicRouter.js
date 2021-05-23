const express = require('express')
const router = express.Router()
const {retrieveRandomSong} = require("../generateSongs.js")

router.route('/randomSong').post((req,res) => {
  
    const song = retrieveRandomSong()
    res.json(song)
})


module.exports = router