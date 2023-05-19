import express from "express";
import morgan from "morgan";
import { Server as SocketServer} from "socket.io";
import http from 'http'
import cors from 'cors'
import { PORT } from "./config.js";

const app = express() //servidor de express
const server = http.createServer(app) //servidor de node real

const io = new SocketServer(server, {//pasarle el server a socket i
    cors: {origin: 'http://localhost:5173'} //permitir que otro puerto se conecte
}) 

app.use(cors()) //cualquier servidor externo podrá conectarse 
app.use(morgan("dev")) //Muestra las peticiones en la consola

io.on('connection', (socket)=>{   //escuchar evento connection y hacer algo 
    // console.log(socket.id);
    socket.on("msg", ({msgUsuario, nombre})=>{  //on porque escucha el emit del fron
        console.log(msgUsuario);
        socket.broadcast.emit("msg", {
            body: msgUsuario,
            from: nombre
        }) //re emitir a todos los usuarios
    }) 
}) 

server.listen(PORT) //montar servidor en el puerto importado
// console.log("server en el puerto " , PORT)