
import {createContext, useEffect, useState, useContext} from "react"
import { useSelector } from "react-redux";
import io from "socket.io-client"

export const SocketContext = createContext()

export const useSocketContext = () => {
    const context = useContext(SocketContext)
    if(!context) throw new Error("useSocketContext must be used within a SocketContextProvider")
    return context
}

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([])

    const userData = useSelector((state) => state.auth.userData)
    console.log( "userData: ",userData)

    useEffect(() => {
        if(userData) {
            const socket = io("http://localhost:3000", {
                query: {
                    userId: userData.id
                }
            });

            setSocket(socket)

            // socket.on is used to listent to the event. can be used both on client and server
            socket.on("getOnlineUsers", (users) => {
                setOnlineUser(users)
            })
            return () => socket.close()
        }else{
            if(socket){
                socket.close();
                setSocket(null)
            }
        }
    },[userData])
    return <SocketContext.Provider value={{socket, onlineUser}}>{children}</SocketContext.Provider>
}
