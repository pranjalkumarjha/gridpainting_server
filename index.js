import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; 

const port  = 3001;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins. Replace with specific domain(s) in production.
      methods: ['GET', 'POST'] // Allow specific HTTP methods.
    }
  });

const allRooms = {};
app.use(cors());
app.get('/',(req,res)=>{
    res.send('reached /')
})
io.on('connection', (socket) => {
  socket.on('joinRoom',(room)=>{
      if(!socket.rooms.has(room)){
        
        if(!(room in allRooms)){  // !io.sockets.adapter.rooms.has(room) didn't use this coz maybe i'll save some info roomwise in future
          socket.emit('serverReply','Invalid room');
        }
        else{
          socket.join(room); 
          allRooms[room] +=1;
          const reply = {message:`Joined room ${room}`,precedence:allRooms[room]-1};
          socket.emit('serverReply',reply);
          socket.to(room).emit('serverReply',{
            sender: socket.id, 
            msg:'new user joined'
          })
          // save some user information here
        } 
        
      }
  }); 
  socket.on('createRoom',(room)=>{

      if(room in allRooms){
        socket.emit('serverReply','Room name already taken'); 
      }
      else{
        socket.join(room); 
        allRooms[room] =1;
        const reply = {message:`Room ${room} created Successfully`,precedence:allRooms[room]-1,createRoom:1};
        socket.emit('serverReply',reply);
      }
  }); 
  socket.on('chat',(room,msg)=>{
    console.log(room,msg)
    socket.to(room).emit('chat',{
      sender: socket.id, 
      msg
    })
  })

  socket.on('updateCurves',(room,recievedObject)=>{
    console.log(room);
    socket.to(room).emit('updateCurves',{
      sender: socket.id, 
      recievedObject
    })
  })
  socket.on('updateGroups',(room,groups)=>{
    socket.to(room).emit('chat',{
      sender: socket.id, 
      groups
    })
  })
  socket.on('updateAnimationList',(room,animationList)=>{
    socket.to(room).emit('chat',{
      sender: socket.id, 
      animationList
    })
  })

});


server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});