import path from "path";
// const express = require('express');
import express from 'express';
import cookieParser from 'cookie-parser';
// const app = express();
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
// const dotenv = require('dotenv');
import dotenv from 'dotenv';
dotenv.config();

import { app, server } from "./socket/socket.js";
const __dirname = path.resolve();

const PORT = process.env.PORT;
console.log("port:", PORT);
console.log("process.env.JWT_SECRET:", process.env.JWT_SECRET);
app.get("/jothi",(req,res)=>{
    res.send("Hello JOTHI LAKSHMI !!");
});
app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, ()=>{
    connectToMongoDB();
    console.log(`Server starting at port ${PORT}`);
});


