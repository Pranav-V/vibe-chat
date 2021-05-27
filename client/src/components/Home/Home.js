import React, {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"

import "./Home.css"
import axios from "axios"

export default function Home()
{
    const [name,setName] = useState("")
    const [joincode,setJoinCode] = useState("")
    const history = useHistory()
    const [firstClick,setFirstClick] = useState(true)
    useEffect(()=> {
        document.getElementById('input-btn').addEventListener('click', function () {
        document.getElementById('input-txt').classList.add('active');
        document.getElementById('input-txt').style.display = "inline-block"
        document.getElementById('input-btn').classList.add('shrink');
        document.getElementById('input-btn').innerHTML = "Join"
        });
        
        const {room} = parseQuery(window.location.href)
        if(room!=undefined)
        {
            setJoinCode(room)
            document.getElementById("input-btn").click()
        }
    }, [])
    function parseQuery(queryString) {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }
    function createRoom()
    {
        if(!name.length>0)
        {
            document.getElementById("error-notification").innerHTML = "Please enter a name."
            return
        }
        axios.post("/createRoom", {name})
            .then(res => {
                if(res.data.success)
                {
                    sessionStorage.setItem("name", name)
                    sessionStorage.setItem("room",res.data.room)
                    sessionStorage.setItem("img",res.data.img)
                    history.push('/chat')
                }
                else
                {
                    document.getElementById("error-notification").innerHTML = res.data.message
                }
            })
            .catch(err => console.log(err))
    }
    function joinRoom()
    {
        if(firstClick)
        {
            console.log("here2")
            setFirstClick(false)
            return
        }
        if(name.length==0)
        {
            document.getElementById("error-notification").innerHTML = "Please enter a name."
            return
        }
        if(joincode.length==0 && !firstClick)
        {
            document.getElementById("error-notification").innerHTML = "Please enter a room code."
            return
        }
        if(joincode.length!=0 && name.length>0)
        {
            console.log("im here")
            axios.post("/joinRoom", {name,room:joincode})
                .then(res => {
                    if(res.data.success)
                    {
                        sessionStorage.setItem("name", name)
                        sessionStorage.setItem("room",res.data.room)
                        sessionStorage.setItem("img",res.data.img)

                        history.push('/chat')
                    }
                    else
                    {
                        document.getElementById("error-notification").innerHTML = res.data.message
                    }
                })
        }
    }
    return ( 
        <>
        <div>
            <div className="context">
                <h1>🎶 Vibe Chat 🎶</h1>
                <p style = {{textAlign:"center", color: "white"}}>Hang out, chill, and vibe with your friends.</p>
                <p id="error-notification"></p>
            </div>
            <div className = "context">
                <div id = "login-box">
                    <form>
                        <input
                            type = "text"
                            required = {true}
                            placeholder = "Your Name"
                            className = "infobox"
                            autoCorrect = "false"
                            value = {name}
                            onChange = {(event) => setName(event.target.value)}
                        />
                        <br/>
                        <br/>
                        <button type="button" onClick = {createRoom} id = "hbutton" className = "btn btn-success">Create Room</button>
                        <br/>
                        <br/>
                        <input 
                            type="text"
                            value = {joincode}
                            onChange = {(event) => setJoinCode(event.target.value)}
                            id="input-txt"
                            placeholder = "Enter Room Code"
                            style = {{border: "none"}}
                            autoCorrect = "false"
                        />
	                    <button type="button" onClick = {joinRoom} className = "btn btn-success" type="button" id="input-btn">Join Room</button>  
                    </form>
                </div>
            </div>
            <div className="area" >
                <ul className="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
            </div >
        </div>
        </>
    )
}