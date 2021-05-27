const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
const Chat = require('./models/chat.model')
const Team = require('./models/room.model')
const User = require('./models/user.model')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const {generateSongs} = require("./generateSongs.js")
const {retUserInfo,addSocket} = require("./socketuser.js")
const router = require('./routes/router')
const app = express()
const path = require('path')
require('dotenv')

const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, './client/build/')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/'))
})

generateSongs()

mongoose.connect("mongodb+srv://pnav:pdatabase@cluster0.jvhte.mongodb.net/music-chat?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB connection established')
})

io.on('connection', (socket) => {
    socket.on('join', ({name,room}, callback) => {
        addSocket(socket,name,room)
        const number = Math.floor(Math.random()*5)
        Chat.find({room:room, user: "admin"})
            .then(info => {
                var hap = false
                info.forEach(element => {
                    if(element.message==name)
                    {
                        hap = true
                    }
                })
                if(!hap)
                {
                    io.to(room).emit("message", {user: 'admin', text: `${name}`, img: number})
                    //socket.broadcast.to(room).emit('message', {user: 'admin', text : `${name}, has joined!`})
                    const nMes = new Chat({room: room, user: "admin", message:name, img: number})
                    nMes.save()
                }
            })
        
        Chat.find({room:room}).sort({createdAt:1})
        .then(res => { 
            const formatted = res.map(element => {
                return {user:element.user,text:element.message,img:element.img,createdAt:element.createdAt}
            })
            //socket.to(room).emit('greetingMessage', {user: "admin", text : name})
            socket.emit("messageHistory", formatted)
        })
        socket.join(room)
    })
    socket.on('sendMessage', ({message, name, room, img}, callback) => {
        const nMes = new Chat({room: room,user:name,message,img})
        nMes.save()
            .then((res) => {
                io.to(room).emit('message', {user: name, text : message, img: img, createdAt: res.createdAt})
            })
            .catch(err => {console.log(err)})
        callback()
    })
    socket.on('updateBoard', ({room}, callback) => {
        Team.find({room:room})
            .then(info => {
                var dataA = info[0].lSongs
                dataA.sort((a,b) => {
                    if(a[1]==b[1])
                    {
                        return 0
                    }
                    if(a[1]>b[1])
                    {
                        return -1 
                    }
                    if(a[1]<b[1])
                    {
                        return 1
                    }
                })
                const finalResult = dataA.filter(element => element[1] > 0)

                io.to(room).emit('board', {sortedData: finalResult})
            })
    })
    socket.on('disconnect', () => {
        //io.to(user.room).emit('message', {user:user.name, text: user.name + " has disconnected."})
        retUserInfo(socket,io)
       
    })
})

app.use(router)
const musicRouter = require("./routes/musicRouter")
const Room = require('./models/room.model')

app.use('/music',musicRouter)

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

