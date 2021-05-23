import axios from "axios"
import React, {useState,useEffect} from "react"
import "./Mi.css"
import images from "../ChatBox/images"
import $ from 'jquery'; 


export default function MoreInformation(props)
{
    useEffect( () => {
        //document.getElementById("boi").muted = true
        //document.getElementById("boi").play()
    }, [])
    
    const [members,setMembers] = useState([])
    useEffect(() => {
        let room = props.room

        axios.post("/getMemberData", {"room":sessionStorage.getItem("room")})
            .then(res => {
                console.log(res)
                setMembers(res.data)
            })
            .catch(err => console.log(err))
    },[props])
    var data = []
    if(members.length!=0)
    {
        data = members.map((element) => {
            return(
            <div key={element[0]} className = "col-lg-6 col-md-6 col-sm-12">
                <span  id="tile">
                    <img id = "simage" src = {images[element[1]]} />
                    <p style={{marginBottom:"0px"}}>{element[0]}</p>
                </span>
            </div>
            )
    })}

    return ( 
        <div id = "mcontainer">
            <div id="members">
                <h4 id = "titlem">Members ({members.length})</h4>
                <div className = "container-fluid">
                    <div className = "row">
                        {data}
                    </div>
                </div>
            </div>
            
        </div>
    )
}