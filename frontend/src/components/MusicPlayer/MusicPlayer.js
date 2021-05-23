import React, {useState,useEffect} from "react"
import "./MusicPlayer.css"
import axios from "axios"
import Vine from "../../image_assets/thing.gif"
import ReactAudioPlayer from 'react-audio-player';
import Shuffle from "../../image_assets/shuffle.png"

export default function MusicPlayer(props)
{
    const [currentSong, setCurrentSong] = useState({})
    useEffect(() => {
        axios.post("/music/randomSong")
            .then(res => {
                setCurrentSong(res.data)
            })
    }, [])
    function retrieveRandomSong()
    {
        axios.post("/music/randomSong")
            .then(res => {
                setCurrentSong(res.data)
            })
    }
    return( 
        <div className = "mcontainer">
            <div className = "image_container">
                <h3>🎶Vibe to Music🎶</h3>
                <img height = {150} src = {Vine} />
            </div>
            <h4 id="nametitle">{currentSong.name}</h4>
            <h6 id="artitle">Artist: {currentSong.artist_name}</h6>
            <ReactAudioPlayer
                src= {currentSong.audio}
                autoPlay
                controls
                id="player"
                onEnded = {retrieveRandomSong}
            />
            <div className = "interactables">
                <img height = {50} id = "shuffle" src={Shuffle} onClick = {retrieveRandomSong}/>
                <p>Next Song</p>
            </div>
        </div>
    )
}