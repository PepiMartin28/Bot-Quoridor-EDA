const {WebSocket} = require('ws');
const socket = new WebSocket("wss:4yyity02md.execute-api.us-east-1.amazonaws.com/ws?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoibWFydGlucGVwaV85OUBob3RtYWlsLmNvbSJ9.joYRVEStX7GDZppIcJGbprIJUxPEs5DPuZ5g4L0E8bE");
const {proccessMessage} = require('./app.js')

socket.on("message", (message_rec) => {
    let datos = JSON.parse(message_rec);
    console.log('Recieved: %s', message_rec);
    if(datos.event != 'list_users' && datos.event != 'game_over'){
        var message_env = proccessMessage(datos);
        sendMessage(message_env);
    }
});

async function sendMessage(message){
    try{
        console.log(message.action)
        console.log(message.data) 
        await socket.send(JSON.stringify(message));
    }catch(error){
        console.log(error.message);
    }
}