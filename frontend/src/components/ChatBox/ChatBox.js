import React, {useState,useEffect} from "react"
import "./ChatBox.css"
import images from "./images"
import Message from ".././Message/Message"
console.log(images.length)
export default function ChatBox(props)
{
    const [message,setMessage] = useState("")

    useEffect(() => {
        var elem = document.getElementById('mContainer');
        elem.scrollTop = elem.scrollHeight;
    }, [props])
    function scrollDown()
    {
        console.log("here")
        var elem = document.getElementById('mContainer');
        elem.scrollTop = elem.scrollHeight;
    }
    function sendMessage(event)
    {
        event.preventDefault()
        props.socket.emit("sendMessage", {message,name: props.name, room: props.room, img: props.img}, () => {
            setMessage('')
        })
    }
    
    const mConverted = props.messages.map((element) => {
        return <Message user = {element.user} createdAt = {element.createdAt} imageData = {images} text = {element.text} img = {element.img} key = {Math.random()} />
    })
    return ( 
        <div className = "outer-container">
            <div className = "header">
                <div style = {{height: "50%", marginLeft:"10px", position:"relative", top:"25%", display:"table"}}>
                    <b style={{color:"white", verticalAlign:"middle", display:"table-cell"}}>🎵&nbsp;&nbsp; Room - {props.room}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                </div>
            </div>
            <div className = "messageContainer" id="mContainer">
                <div className = "container-fluid">
                    <div style = {{ textAlign:"right", marginRight: "20px"}}>
                        <button id= "toggle" onClick = {scrollDown} style={{float:"right", marginRight: "10px", border:"none",background:"white",position: "fixed", float: "right"}}>🔵↓</button>
                    </div>
                    <br/>
                    {mConverted}
                </div>
            </div>
            <div className = "input-field">
                <input
                    type="text"
                    id="text-submit"
                    placeholder = {"Message @Room - "+props.room}
                    maxLength = {100}
                    value = {message}
                    onChange = {(event) => setMessage(event.target.value)}
                    onKeyPress = {(event) => event.key==="Enter"? sendMessage(event): null}
                />
            </div>
        </div>
    )
}