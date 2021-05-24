var userSocket = []
const User = require("./models/user.model")
const Room = require("./models/room.model")
const Chat = require("./models/chat.model")
function addSocket(socket,name,room)
{
    userSocket.push({"socket":socket,"name":name,"room":room})
}

function retUserInfo(socket,io)
{
    userSocket.forEach(element => {
        if(element.socket == socket)
        {
            const index = userSocket.indexOf(element)
            userSocket.splice(index,1)
            const user = element
            User.deleteOne({name:user.name,room:user.room})
            .then(() => {
                Room.find({room:user.room})
                    .then(data => {
                        var members = data[0].members
                        const index = members.indexOf(user.name)
                        members.splice(index,1)
                        console.log(members)
                        data[0].members = members
                        data[0].save()
                            .then(() => {
                                io.to(user.room).emit("message", {user: 'admin', text: `${user.name}`, img: -5})
                                const nMes = new Chat({room: user.room, user: "admin", message:user.name, img: -5})
                                nMes.save()
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    })
}

module.exports = {retUserInfo,addSocket}