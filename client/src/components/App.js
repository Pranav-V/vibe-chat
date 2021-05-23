import React from "react"
import {BrowserRouter, Route} from 'react-router-dom'
import Home from "./Home/Home"
import Chat from "./Chat/Chat"
export default function App()
{
    return ( 
        <BrowserRouter>
            <Route path = "/" exact component = {Home} />
            <Route path = "/chat" exact component = {Chat} />
        </BrowserRouter>
    )
}
