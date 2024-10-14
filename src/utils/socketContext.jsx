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
    const [onlineUser, setOnlineUser] = useState([]);

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if(userData) {
            const socket = io("http://localhost:3000", {
                query: {
                    userId: userData._id
                }
            });

            setSocket(socket);

            // Listen for online users
            socket.on("getOnlineUsers", (users) => {
                setOnlineUser(users);
            });

            

            return () => {
                socket.off("getOnlineUsers");
                socket.close();
            };
        }else{
            if(socket){
                socket.close();
                setSocket(null)
            }
        }
    },[userData])
    return <SocketContext.Provider value={{socket, onlineUser}}>{children}</SocketContext.Provider>
}
