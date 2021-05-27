import React, {useState,useEffect} from "react"
import "./MusicPlayer.css"
import axios from "axios"
import Vine from "../../image_assets/thing.gif"
import ReactAudioPlayer from 'react-audio-player';
import Shuffle from "../../image_assets/forward.png"
import Back from "../../image_assets/back.png"
import LikeD from "../../image_assets/like_d.png"
import LikeS from "../../image_assets/like_s.png"
import { set } from "mongoose";


export default function MusicPlayer(props)
{
    const [currentSong, setCurrentSong] = useState({})
    const [likeImage, setlikeImage] = useState(LikeD)
    const [likes,setLikes] = useState([])
    const [pointer,setPointer] = useState(0)
    useEffect(() => {
        props.socket.emit("updateBoard", {room: sessionStorage.getItem("room")}, () => console.log("oops"))
        axios.post("/music/randomSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room")})
            .then(res => {
                setCurrentSong(res.data)
                var copy = [...likes,false]
                setLikes(copy)
                props.socket.emit("updateBoard", {room: sessionStorage.getItem("room")}, () => console.log("oops"))
            })
    }, [])
    useEffect(() => {
        if(props.transfer != "")
        {
            axios.post("/music/nextSpecificSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room"), id: props.transfer})
                .then(res => {
                    if(res.data.success)
                    {
                        setCurrentSong(res.data.song)
                        var copy = [...likes,false]
                        setLikes(copy)
                        setPointer(copy.length-1)
                        document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
                        document.getElementById("likeinfo").innerHTML = "Like"
                        setlikeImage(LikeD)
                    }
                    else
                    {
                        setCurrentSong(res.data.song)
                        setPointer(res.data.index)
                        if(likes[res.data.index])
                        {
                            document.getElementById("shufflechange").style.backgroundColor = "white"
                            document.getElementById("likeinfo").innerHTML = "Like (Yes)"
                            setlikeImage(LikeS)
                        }
                        else
                        {
                            document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
                            document.getElementById("likeinfo").innerHTML = "Like"
                            setlikeImage(LikeD)
                        }
                    }
                })
        }
    },[props.transfer])
    function retrieveNextSong()
    {
        document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
        document.getElementById("likeinfo").innerHTML = "Like"
        setlikeImage(LikeD)
        axios.post("/music/nextSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room")})
            .then(res => {
                if(pointer==likes.length-1)
                {
                    var copy = [...likes,false]
                    setLikes(copy)
                }
                if(likes[pointer+1])
                {
                    document.getElementById("shufflechange").style.backgroundColor = "white"
                    document.getElementById("likeinfo").innerHTML = "Like (Yes)"
                    setlikeImage(LikeS)
                }
                else
                {
                    document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
                    document.getElementById("likeinfo").innerHTML = "Like"
                    setlikeImage(LikeD)
                }
                setPointer(pointer+1)
                setCurrentSong(res.data)
                props.reset()
                props.socket.emit("updateBoard", {room: sessionStorage.getItem("room")}, () => console.log("oops"))
            })
    }
    function changeLike(dir)
    { 
        if(currentSong!=undefined)
        {
            var copy = [...likes]
            copy[pointer] = dir=="+"?true:false
            setLikes(copy)
            axios.post("/music/changeLike", {song:currentSong,room:sessionStorage.getItem("room"),dir})
                .then(()=> {
                    props.socket.emit("updateBoard", {room: sessionStorage.getItem("room")}, () => console.log("oops"))
                })
        }
    }
    
    function goBack()
    {
        axios.post("/music/previousSong", {name:sessionStorage.getItem("name"), room: sessionStorage.getItem("room")})
        .then(res => {
            if(res.data.success)
            {
                if(likes[pointer-1])
                {
                    document.getElementById("shufflechange").style.backgroundColor = "white"
                    document.getElementById("likeinfo").innerHTML = "Like (Yes)"
                    setlikeImage(LikeS)
                }
                else
                {
                    document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
                    document.getElementById("likeinfo").innerHTML = "Like"
                    setlikeImage(LikeD)
                }
                props.reset()
                setPointer(pointer-1)
                setCurrentSong(res.data.song_data)
                props.socket.emit("updateBoard", {room: sessionStorage.getItem("room")}, () => console.log("oops"))

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
                <img height = {40} id = "shuffle" src={Shuffle} onClick = {retrieveNextSong}/>
                <p id="infoimg">Next Song</p>
                <img height = {40} id = "shuffle" src={Back} onClick = {goBack}/>
                <p id="infoimg">Previous Song</p>
                <img height = {40} id = "shufflechange" src={likeImage} onClick = {() => {
                    if(likeImage==LikeD)
                    {
                        document.getElementById("shufflechange").style.backgroundColor = "white"
                        changeLike("+")
                        document.getElementById("likeinfo").innerHTML = "Like (Yes)"
                    }
                    else
                    {
                        document.getElementById("shufflechange").style.backgroundColor = "#4e54c8"
                        document.getElementById("likeinfo").innerHTML = "Like"
                        changeLike("-")
                    }
                    setlikeImage(likeImage==LikeD?LikeS:LikeD)
                    
                }
                    
                }/>
                <p id="likeinfo">Like</p>
            </div>
        </div>
    )
}
