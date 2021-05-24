import React, {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"
import "./Home.css"
import axios from "axios"

export default function Home()
{
    const [name,setName] = useState("")
    const [joincode,setJoinCode] = useState("")
    const history = useHistory()
    useEffect(()=> {
        document.getElementById('input-btn').addEventListener('click', function () {
        document.getElementById('input-txt').classList.add('active');
        document.getElementById('input-txt').style.display = "inline-block"
        document.getElementById('input-btn').classList.add('shrink');
        document.getElementById('input-btn').innerHTML = "Join"
        });
    }, [])

    function createRoom()
    {
        axios.post("/createRoom", {name})
            .then(res => {
                if(res.data.success)
                {
                    sessionStorage.setItem("name", name)
                    sessionStorage.setItem("room",res.data.room)
                    sessionStorage.setItem("img",res.data.img)
                    history.push('/chat')
                }
            })
            .catch(err => console.log(err))
    }
    function joinRoom()
    {
        if(joincode.length!=0)
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
                })
        }
    }
    return ( 
        <div>
            <div className="context">
                <h1>🎶 Vibe Chat 🎶</h1>
                <p style = {{textAlign:"center", color: "white"}}>Hang out, chill, and vibe with your friends.</p>
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
    )
}