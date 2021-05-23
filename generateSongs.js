const axios = require("axios")
var Chance = require('chance')
const chance = new Chance()
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
function retrieveRandomSong() 
{
    const room = chance.integer({min:0, max:599})
    return songs[room]
}

module.exports = {generateSongs, retrieveRandomSong}
