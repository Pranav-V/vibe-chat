import React, {useState,useEffect} from "react"
import "./MusicPlayer.css"
import axios from "axios"
import Vine from "../../image_assets/thing.gif"
import ReactAudioPlayer from 'react-audio-player';
import Shuffle from "../../image_assets/forward.png"
import Back from "../../image_assets/back.png"
import LikeD from "../../image_assets/like_d.png"
import LikeS from "../../image_assets/like_s.png"


export default function MusicPlayer(props)
{
    const [currentSong, setCurrentSong] = useState({})
    const [likeImage, setlikeImage] = useState(LikeD)
    useEffect(() => {
        axios.post("/music/randomSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room")})
            .then(res => {
                setCurrentSong(res.data)
            })
    }, [])
    function retrieveNextSong()
    {
        axios.post("/music/nextSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room")})
            .then(res => {
                setCurrentSong(res.data)
            })
    }
    function goBack()
    {
        axios.post("/music/previousSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room")})
        .then(res => {
            console.log(res)
            if(res.data.success)
            {
                setCurrentSong(res.data.song_data)
            }
            
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
                onEnded = {retrieveNextSong}
            />
            <div className = "interactables">
                <img height = {50} id = "shuffle" src={Shuffle} onClick = {retrieveNextSong}/>
                <p id="infoimg">Next Song</p>
                <img height = {50} id = "shuffle" src={Back} onClick = {goBack}/>
                <p id="infoimg">Previous Song</p>
                <img height = {50} id = "shufflechange" src={likeImage} onClick = {() => {
                    if(likeImage==LikeD)
                    {
                        document.getElementById("shufflechange").style.backgroundColor = "white"
                        document.getElementById("likeinfo").innerHTML = "Like (Yes)"
                    }
                    else
                    {
                        document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
                        document.getElementById("likeinfo").innerHTML = "Like"
                    }
                    setlikeImage(likeImage==LikeD?LikeS:LikeD)
                    
                }
                    
                }/>
                <p id="likeinfo">Like</p>
            </div>
        </div>
    )
}