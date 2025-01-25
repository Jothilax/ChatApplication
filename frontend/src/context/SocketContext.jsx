// import { createContext, useState, useEffect, useContext } from "react";
// import { useAuthContext } from "./AuthContext";
// import io from "socket.io-client";

// const SocketContext = createContext();
// export const useSocketContext = () => {
// 	return useContext(SocketContext);
// };

// export const SocketContextProvider = ({ children }) => {
// 	const [socket, setSocket] = useState(null);
// 	const [onlineUsers, setOnlineUsers] = useState([]);
// 	const { authUser } = useAuthContext();

//     useEffect(() => {
// 		if (authUser) {
// 			const socket = io("http://localhost:8000", {
// 				query: {
// 					userId: authUser._id,
// 				},
// 			});

// 			setSocket(socket);

// 			return () => socket.close();
// 		} else {
// 			if (socket) {
// 				socket.close();
// 				setSocket(null);
// 			}
// 		}
// 	}, [authUser]);
//     //if [] is empty the login user will get id (ie - A user connected B3KPkdiRAGpAlEtHAAAg)

// 	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
// }





import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext.jsx";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io("http://localhost:8000", {
				query: { userId: authUser._id },
			});
			setSocket(socket);

			socket.on("onlineUsers", (users) => {
				setOnlineUsers(users);
			});
			

			// socket.on("onlineUsers", (users) => {
			// 	setOnlineUsers(users);
			// });

			socket.on("userConnected", (userId) => {
				setOnlineUsers((prev) => [...prev, userId]);
			});

			socket.on("userDisconnected", (userId) => {
				setOnlineUsers((prev) => prev.filter((id) => id !== userId));
			});
			return () => {
				socket.close();
				socket.off("onlineUsers");
				socket.off("userConnected");
				socket.off("userDisconnected");
			};
			
			// return () => {
			// 	socket.close();
			// 	socket.off("onlineUsers");
			// 	socket.off("userConnected");
			// 	socket.off("userDisconnected");
			// };
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
