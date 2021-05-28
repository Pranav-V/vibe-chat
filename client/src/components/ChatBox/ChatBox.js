import React, {useState,useEffect} from "react"
import "./ChatBox.css"
import images from "./images"
import Message from "../Message/Message"
import URL from "../../image_assets/url.png"
import {
    FacebookShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
  } from'react-share';

export default function ChatBox(props)
{
    const [message,setMessage] = useState("")
    const [link,setLink] = useState("https://mighty-badlands-68802.herokuapp.com/?&room="+sessionStorage.getItem("room"))

    useEffect(() => {
        var elem = document.getElementById('mContainer');
        elem.scrollTop = elem.scrollHeight;
    }, [props])
    function scrollDown()
    {
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
                <div id="trans1" style = {{marginLeft:"10px", position:"relative", display:"table"}}>
                        <div className = "row" style = {{height:"100%",width:"100%"}}>
                            <div className = "col-lg-3 col-md-3 col-sm-12" style={{top:"25%"}}>
                                <b style={{color:"white", verticalAlign:"middle", display:"table-cell"}}>🎵&nbsp;&nbsp; Room - {props.room}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                            </div>
                            <div className = "col-lg-9 col-md-9 col-sm-12" style = {{height:"100%",top:"15%",textAlign:"right"}}>
                                <img id="urlimg" onClick={() => {navigator.clipboard.writeText(link)}} src={URL} style={{borderRadius:"50%",backgroundColor:"white",height:"32px",width:"32px"}} />
                                <WhatsappShareButton
                                    id="attempt"
                                    url={link}
                                    quote={'Vibe Chat Join Link'}
                                    className="Demo__some-network__share-button"
                                >
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                                <TelegramShareButton
                                    url={link}
                                    quote={'Vibe Chat Join Link'}
                                    className="Demo__some-network__share-button"
                                >
                                    <TelegramIcon size={32} round />
                                </TelegramShareButton>
                                
                                <FacebookShareButton
                                        url={link}
                                        quote={'Vibe Chat Join Link'}
                                        className="Demo__some-network__share-button"
                                    >
                                        <FacebookIcon size={32} round />
                                    </FacebookShareButton>
                                <TwitterShareButton
                                        url={link}
                                        quote={'Vibe Chat Join Link'}
                                        className="Demo__some-network__share-button"
                                    >
                                        <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <RedditShareButton
                                         url={link}
                                         quote={'Vibe Chat Join Link'}
                                        className="Demo__some-network__share-button"
                                    >
                                        <RedditIcon size={32} round />
                                </RedditShareButton>
                            </div>
                        </div>                    
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