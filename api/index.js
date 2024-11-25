import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const port = 3001; 

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.get('/',(req,res)=>{
    res.send('got to /');
})

app.get('/joinRoom',(req,res)=>{
    res.json(`join request for ${req.query.roomId} recieved`);
});

app.listen(port,()=>{console.log(`listening on port ${port}`)});

export {app}