const express = require('express');
const path = require('path')
const app = express();

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
    console.log('server is created at 4000')
})

const io = require('socket.io')(server) //pass the https server i.e server

app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()

io.on('connection',onConnected)

function onConnected(socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id);

    io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        console.log('socket disconneted',socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}

