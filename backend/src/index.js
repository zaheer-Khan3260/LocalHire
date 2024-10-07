import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDatabase from "./database/index.js"
import { app, server } from "./socket/socket.js";

dotenv.config({
    path: './env'
});

console.log("Cors origin env", process.env.CORS_ORIGIN);

const corsOptions = {
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));


connectDatabase()
.then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!!", err);
})



app.use(express.json( {limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))
app.use(cookieParser());



import messageRouter from "./routes/message.routes.js"

app.use("/api/v1/message", messageRouter)
