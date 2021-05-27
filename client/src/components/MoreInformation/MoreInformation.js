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
    var table = []
    if(props.board.length!=0)
    {
        table = props.board.map(element => {
            return(
            <tr>
                <td>{element[0].name}</td>
                <td>{element[1]}</td>
                <td><button onClick = {(event) => props.transfer(event)} value = {element[0].id}id="tblebutton">Listen</button></td>
            </tr>)
        })
    }
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
            <div id="musicboard">
                <h4 id = "titlem">Music Board</h4>
                <p id="undertext">🎻Vibe with your Friends!🎻</p>
                <table className="table table-sm" id="tble">
                    <thead>
                        <tr>
                        <th scope="col">Song</th>
                        <th scope="col">Likes</th>
                        <th scope="col">Play Song?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table}
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}