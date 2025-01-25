// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// // const cors = require('cors');
// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
// 	cors: {
// 		origin: ["http://localhost:3000"],
// 		methods: ["GET", "POST"],
// 	},
// });
// // app.use(cors());

// io.on('connection', (socket) => {
//     console.log('A user connected', socket.id);

//     const userSocketMap = {}; // {userId: socketId}

//     const userId = socket.handshake.query.userId;
//     if (userId != "undefined") userSocketMap[userId] = socket.id;
    
//         // io.emit() is used to send events to all the connected clients
//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
//     socket.on('disconnect', () => {
//       console.log('User disconnected', socket.id);
//       delete userSocketMap[userId];
// 		io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
//   });

// // export const getReceiverSocketId = (receiverId) => {
// // 	return userSocketMap[receiverId];
// // };


// // 	// socket.on() is used to listen to the events. can be used both on client and server side
// // 	socket.on("disconnect", () => {
// // 		console.log("user disconnected", socket.id);
// // 		delete userSocketMap[userId];
// // 		io.emit("getOnlineUsers", Object.keys(userSocketMap));
// // 	});
// // });

// export { app, io, server };


import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"], // Adjust for your frontend origin
		methods: ["GET", "POST"],
        credentials: true ,
        
	},
});

const userSocketMap = {}; // Global map for userId -> socketId

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("userId:", userId);
  if (userId) {
      userSocketMap[userId] = socket.id;
      console.log("userSocketMap:", userSocketMap);

      // Emit online users list
      io.emit("onlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);

      const disconnectedUserId = Object.keys(userSocketMap).find(
          (key) => userSocketMap[key] === socket.id
      );
      if (disconnectedUserId) {
          delete userSocketMap[disconnectedUserId];
      }

      io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});



// io.on("connection", (socket) => {
// 	console.log("A user connected", socket.id);

// 	// Extract userId from handshake query
// 	const userId = socket.handshake.query.userId;
//   console.log("userId:",userId);
// 	if (userId) {
// 		// Map userId to the connected socket ID
// 		userSocketMap[userId] = socket.id;
//     console.log("userSocketMap:",userSocketMap);
// 		// Broadcast updated online users to all clients
// 		io.emit("onlineUsers", Object.keys(userSocketMap));

// 	}

// 	// Handle disconnection
// 	socket.on("disconnect", () => {
// 		console.log("User disconnected", socket.id);

// 		// Find and remove the disconnected user's ID from the map
// 		const disconnectedUserId = Object.keys(userSocketMap).find(
// 			(key) => userSocketMap[key] === socket.id
// 		);
// 		if (disconnectedUserId) {
// 			delete userSocketMap[disconnectedUserId];
// 		}

// 		// Broadcast updated online users
// 		io.emit("OnlineUsers", Object.keys(userSocketMap));
// 	});
// });

// Optional: Export helper function to get socket ID by user ID
export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

export { app, io, server };
