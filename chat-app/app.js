const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');


const app = express();
const https = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('combined'))
app.use(cors());

app.set('trust proxy', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const expressValidator = require('express-validator');
global.__basedir = __dirname;

mongoose.connect(`mongodb://127.0.0.1:27017/chatApp`, { useNewUrlParser: true }, (err, result) => {
    if (err) {
        console.log("Error in connecting with database")
    }
    else {
        console.log('Mongoose connecting is setup successfully')
    }
});


process.on('uncaughtException', function (err) {
    console.log(err);
})

//==========================Request Console=======================//

app.all("*", (req, resp, next) => {
    let obj = {
        Host: req.headers.host,
        ContentType: req.headers['content-type'],
        Url: req.originalUrl,
        Method: req.method,
        Query: req.query,
        Body: req.body,
        Parmas: req.params[0]
    }
    console.log("Common Request is===========>", [obj])
    next();
});

app.use(expressValidator())

app.use('/api/v1/admin', route);
app.use('/api/v1/user', userRoute);

const io = require("socket.io")(https, {
    cors: {
        origins: [
            "http://localhost:3001",
            "http://localhost:4200",
            "http://localhost:8080",
        ],
    },
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log('token', token);
    next();
});

io.sockets.on('connection', function (client) {
    console.log("new connection created...")
    client.on('subscribe', function (data) {
        console.log(data.user+' joined the room', data.room);
        client.join(data.room);
        client.broadcast.to(data.room).emit('new user join',{user:data.user,message:"has joined the room"})
    })

    client.on('unsubscribe', function (data) {
        console.log(data.user+' leaving room', data.room);
        client.leave(data.room);
        client.broadcast.to(data.room).emit('left room',{user:data.user,message:"has left the room"})
    })

    client.on('message', function (data) {
        console.log('sending message', data);
        // io.sockets.in(data.room).emit('message', data);
        io.in(data.room).emit('new message', {user:data.user,message:data.message});

    });

    client.on('typing', function (data) {
        console.log('typing', data);
        // io.sockets.in(data.room).emit('message', data);
        // io.in(data.room).emit('typing', {user:data.user,message:data.user+" is typing"});
        if(data){
            client.broadcast.to(data.room).emit('typing',{user:data.user,message:"typing ddd"})
        }
        
    });
});

https.listen(3001, () => {
    console.log('listening on *:3001');
});

