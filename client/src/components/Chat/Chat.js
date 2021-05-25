import React, {useEffect,useState} from "react"
import axios from "axios"
import io from "socket.io-client"
import ChatBox from "../ChatBox/ChatBox"
import MoreInformation from "../MoreInformation/MoreInformation"
import MusicPlayer from "../MusicPlayer/MusicPlayer"
import $ from "jquery"
let socket

export default function Chat()
{
    var reset = false
    window.onload = function(){
        if(window.location.href == sessionStorage.getItem("origin")){
            reset = true
            sessionStorage.clear();
            window.location.href = "/"
        }
    }
    var x = 1; 
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")
    const [img, setImg] = useState("")
    const [messages, setMessages] = useState([]);
    const [music, setMusic] = useState([])
    var connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    };
    var reset2 = false
    if(sessionStorage.getItem("room") == null || sessionStorage.getItem("name") ==null)
    {
        reset2 = true

        window.location.href = "/"
    }
    //http://localhost:5000/
    // 'https://mighty-badlands-68802.herokuapp.com/'
    socket = io.connect('https://mighty-badlands-68802.herokuapp.com/',connectionOptions)
    console.log("asdfhi")
    console.log('burh')
    useEffect(() => {
        if(sessionStorage.getItem("name") != null || sessionStorage.getItem("room") != null)
        {
            socket.emit("join", {name:sessionStorage.getItem("name"),room:sessionStorage.getItem("room")}, () => {
                console.log("err")
            })
            setName(sessionStorage.getItem("name"))
            setRoom(sessionStorage.getItem("room"))
            setImg(sessionStorage.getItem("img"))
        }
    },[])
    useEffect(() => {
        socket.on('message', message => {
            console.log(message)
            setMessages(messages => [ ...messages, message ]);
            
          });
        socket.on('messageHistory', message => {
            console.log(message)
            setMessages(messages => [...message,...messages])
        })
        socket.on('greetingMessage', message => {
            setMessages(messages => [...messages, message])
        })

    },[])
    useEffect(() => {
        window.onbeforeunload = function() {
            sessionStorage.setItem("origin", window.location.href);
          };
    })
    function musicPlay()
    {
        
        //setMusic(music+1)
    }
    if(reset || reset2)
    {
        return <div></div>
    }
    return ( 
        <div className = "container-fluid">
            <div className = "row">
                <div className = "col-lg-3 col-md-3 col-sm-0" style={{backgroundColor:"#4e54c8", padding: "0px"}}>
                    <MusicPlayer name = {name} room = {room} />
                </div>
                <div className = "col-lg-7 col-md-9 col-sm-12" style= {{height:"100vh"}}>
                    <ChatBox socket = {socket} name ={name} room ={room} img = {img} messages = {messages} />
                </div>
                <div className = "col-lg-2 col-md-0 col-sm-0" style = {{padding:"0px",height: "100vh", backgroundColor:"#f2f3f5"}}>
                    <MoreInformation room = {room}/>
                </div>
            </div>
            
        </div>
    )
}