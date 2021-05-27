const axios = require("axios")
var Chance = require('chance')
const chance = new Chance()
const User = require("./models/user.model")
var songs = []

function generateSongs() 
{
    axios.get("https://api.jamendo.com/v3.0/tracks/?client_id=b0568c9a&format=jsonpretty&limit=all")
            .then(res => {
                songs = [...res.data.results,...songs]
                axios.get("https://api.jamendo.com/v3.0/tracks/?client_id=b0568c9a&format=jsonpretty&limit=all&offset=800")
                    .then(info => {
                        songs = [...info.data.results,...songs]
                        axios.get("https://api.jamendo.com/v3.0/tracks/?client_id=b0568c9a&format=jsonpretty&limit=all&offset=3500")
                            .then(again => {
                                songs = [...again.data.results,...songs]
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        
    


}
function retrieveRandomSong(name,room) 
{
    const ranSong = chance.integer({min:0, max:599})
    User.find({name,room})
        .then(res => {
            const cuser = res[0]
            const narray = [...cuser.prevSongs,ranSong]
            cuser.prevSongs = narray
            cuser.currentPosition = cuser.currentPosition + 1
            cuser.save()
                .then(() => {return songs[ranSong]})
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

    return songs[ranSong]
}
function retrieveSongById()
{
   return songs
}
function retrieveSpecificSong(position)
{
    return songs[position]
}

module.exports = {generateSongs, retrieveRandomSong, retrieveSpecificSong, retrieveSongById}
