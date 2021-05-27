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
    const [board,setBoard] = useState([])
    const [music, setMusic] = useState([])
    const [transfer,setTransfer] = useState([])
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
    useEffect(() => {
        if(!reset && !reset2 && sessionStorage.getItem("name") != null && sessionStorage.getItem("room") != null)
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
            setMessages(messages => [ ...messages, message ]);
            
          });
        socket.on('messageHistory', message => {
            setMessages(messages => [...message,...messages])
        })
        socket.on('greetingMessage', message => {
            setMessages(messages => [...messages, message])
        })
        socket.on('board', message => {
            setBoard(message.sortedData)
        })

    },[])
    useEffect(() => {
        window.onbeforeunload = function() {
            sessionStorage.setItem("origin", window.location.href);
          };
    })
    function transferData(event)
    {
        setTransfer("" + event.target.value)
    }
    function resetTransfer()
    {
        setTransfer("")
    }
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
                <div className = "col-lg-3 col-md-3 d-none d-md-block" style={{backgroundColor:"#4e54c8", padding: "0px"}}>
                    <MusicPlayer reset = {resetTransfer} transfer = {transfer} name = {name} room = {room} socket = {socket}/>
                </div>
                <div className = "col-lg-7 col-md-9 col-sm-12" style= {{height:"100vh"}}>
                    <ChatBox socket = {socket} name ={name} room ={room} img = {img} messages = {messages} />
                </div>
                <div className = "col-lg-2 col-md-0 d-none d-lg-block" style = {{padding:"0px", backgroundColor:"#f2f3f5"}}>
                    <MoreInformation transfer = {transferData} room = {room} board={board}/>
                </div>
            </div>
            
        </div>
    )
}