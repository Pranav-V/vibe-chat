import React from "react"
import "./Message.css"
import {emojify} from 'react-emojione';

export default function Message(props)
{
    const messages = ["How's it going $$$? 😊", "Welcome, $$$. Ready to jam? 🎸", "$$$ showed up! 🐶", "We've been expecting you $$$. It's time to jam! ⏰", "$$$ has joined. Ready to vibe? 🎧"]
    const time = new Date(props.createdAt);
    var date = time.toLocaleDateString()
    if(date == new Date().toLocaleDateString())
    {
        date = "Today"
    }
    const ctime = time.toLocaleTimeString('en-US',{hour: '2-digit', minute: '2-digit'})
    const ret = date + " at " + ctime
    if(props.user=="admin" && props.img==-5)
    {
        return ( 
            <div className="row">
                <div className = "col-lg-12 col-md-12 col-sm-12">
                    <div className = "row" id= "container">
                        <p id="wave">🦘</p>
                        <p id="message">See you later {props.text}</p>
                    </div>
                </div>
            </div>
        )
    }
    if(props.user=="admin")
    {
        return ( 
            <div className="row">
                <div className = "col-lg-12 col-md-12 col-sm-12">
                    <div className = "row" id= "container">
                        <p id="wave">👋</p>
                        <p id="message">{messages[props.img].replace("$$$",props.text)}</p>
                    </div>
                </div>
            </div>
        )
    }
    else
    {
        morphedText = ""
        if(props.text!=null)
        {
            var morphedText = props.text
            var swearjar= require('swearjar'),
            morphedText = swearjar.censor(morphedText)
            morphedText = emojify(morphedText)
        }

    return ( 
        <div className="row" id="bc">
            <div className = "col-lg-12 col-md-12 col-sm-12" style={{paddingLeft:"0px"}}>
                <div className = "row" id= "container">
                    <div className = "col-lg-1 col-md-1 col-sm-12" style={{margin:"0px"}}>
                        <img id = "pimage" src = {props.imageData[props.img]}/>
                    </div>
                    <div className = "col-lg-10 col-md-10 col-sm-10" style={{margin:"0px", marginLeft:"0px"}}>
                        <div id="text">
                                <b>{props.user}</b><i id="time-format">{ret}</i>
                                <p id="extra-text-format">{morphedText}</p>
                            </div>
                    </div>
                </div>
            </div>
        </div>

    )
    }
}