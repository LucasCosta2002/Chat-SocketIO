import { useEffect, useState } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io("http://localhost:4000") //pasarle donde se va a conectar

function App() {
    
    const [msgUsuario, setMsgUsuario] = useState('')
    const [chats, setChats] = useState([])
    const [nombre, setNombre] = useState("")
    const [alerta, setAlerta] = useState(false)
    const [auth, setAuth] = useState(false)
    

    const handleSubmit = e =>{
        e.preventDefault()
        if(msgUsuario === '') {
            return
        }else{
            socket.emit("msg", {msgUsuario, nombre}) //mandar al backend, emit porque envia
            const nuevoMensaje = {
                body: msgUsuario,
                from: "Yo"
            }
            setChats([...chats, nuevoMensaje]);
            setMsgUsuario('')
        }
    }

    useEffect(() => {
        const recibirMsg = msg =>{ //escuchar cuando el backend emite un msg y ponerlo en el state
            setChats([...chats, msg]);
        }
        socket.on("msg", recibirMsg)

        return ()=>{ //desconectar para emitir otros
            socket.off("msg", recibirMsg)
        }
    }, [chats])

    const handleSubmitNombre = e =>{
        e.preventDefault()
        if(nombre === "") {
            setAlerta(true)
            return
        }
        setAuth(true)
        setTimeout(() => {
            setAlerta(false)
        }, 3000);

    }  

    return (
        <>
            {auth == true ? 
                    <div className='bg-white p-3 w-3/4 h-screen mt-5 mx-auto flex flex-col justify-end rounded-md mb-4 shadow-md'>
                        <div className={`p-3 flex flex-col ${msgUsuario.from === "Yo" ? "left-1" : "items-end"} overflow-y-auto `}>
                            {chats.map((chat, index) => (
                                <div
                                    className={`${chat.from === "Yo" ? "bg-sky-400 ml-auto rounded-tr-none" : "bg-sky-700 mr-auto rounded-tl-none"} table rounded-lg px-3 py-1 my-1 w-auto  text-white`}
                                    key={index}    
                                >{chat.from}: {chat.body} 
                                </div>
                            ))}
                        </div>
                        <form className='flex gap-2' >
                            <input 
                                type="text"
                                placeholder='Escribe un mensaje...'
                                className='w-full bg-gray-200 rounded-md p-2'
                                onChange={(e)=> setMsgUsuario(e.target.value)}
                                value={msgUsuario}
                            />
                            <input type='submit' value="Enviar" className='bg-sky-500 p-2 text-white font-bold rounded-md hover:bg-sky-600 cursor-pointer' onClick={handleSubmit}/>
                        </form>
                    </div>
            : 
                <div className="my-20 max-w-lg mx-auto bg-white shadow p-10 rounded-md ">
                    <form onSubmit={handleSubmitNombre}>
                        {alerta ? <p className='bg-red-600 uppercase text-white font-bold text-center rounded-md p-1 mb-2'>Todos los campos son obligatorios</p> : null}
                        <div className='mb-3'>
                            <label htmlFor="nombre" className='w-full block uppercase font-black text-sky-500'>Nombre de Usuario</label>
                            <input 
                                type="text" 
                                placeholder='Tu nombre de usuario' 
                                id='nombre'
                                value={nombre} 
                                onChange={(e)=>setNombre(e.target.value)} 
                                className='mt-4 px-2 py-1 w-full bg-slate-200 text-gray-700 rounded-md'
                            />
                        </div>
                        <input type="submit" value="Entrar" className='bg-sky-500 p-2 uppercase font-bold border-none mt-3 text-white rounded-md hover:bg-sky-600 transition-all'/>
                    </form>			
                </div>
            }
        </>
    )
}

export default App
