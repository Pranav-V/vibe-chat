const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
const Chat = require('./models/chat.model')
const User = require('./models/user.model')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const {generateSongs} = require("./generateSongs.js")
const router = require('./routes/router')
const { forEach } = require('../client/src/components/ChatBox/images.js')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(cors())

generateSongs()

mongoose.connect("mongodb+srv://pnav:pdatabase@cluster0.jvhte.mongodb.net/music-chat?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB connection established')
})

io.on('connection', (socket) => {
    socket.on('join', ({name,room}, callback) => {
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
                    io.emit("message", {user: 'admin', text: `${name}`, img: number})
                    //socket.broadcast.to(room).emit('message', {user: 'admin', text : `${name}, has joined!`})
                    const nMes = new Chat({room: room, user: "admin", message:name, img: number})
                    nMes.save()
                }
            })
        
        console.log("here")
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
                console.log(res)
                console.log("here")
                io.to(room).emit('message', {user: name, text : message, img: img, createdAt: res.createdAt})
                console.log('here')
            })
            .catch(err => {console.log(err)})
        callback()
    })
    socket.on('disconnect', () => {
        //io.to(user.room).emit('message', {user:user.name, text: user.name + " has disconnected."})    
    })
})

app.use(router)
const musicRouter = require("./routes/musicRouter")

app.use('/music',musicRouter)

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

