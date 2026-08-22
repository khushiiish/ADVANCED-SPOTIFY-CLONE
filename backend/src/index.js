// import express from "express";
// import dotenv from "dotenv";
// import { clerkMiddleware } from "@clerk/express";
// import { createServer } from "node:http";
// import connectDB from "./lib/db.js";
// import fileUpload from "express-fileupload";
// import path from "path";
// import cors from "cors";

// import userRoutes from "./routes/user.route.js";
// import adminRoutes from "./routes/admin.route.js";
// import authRoutes from "./routes/auth.route.js";
// import songRoutes from "./routes/song.route.js";
// import albumRoutes from "./routes/album.route.js";
// import statRoutes from "./routes/stat.route.js";

// dotenv.config();

// const app = express();
// const __dirname = path.resolve();
// const PORT = process.env.PORT || 5000;

// // Create HTTP server
// const httpServer = createServer(app);

// // Socket.IO disabled for now
// // import { initializeSocket } from "./lib/socket.js";
// // initializeSocket(httpServer);

// app.use(
//     cors({
//         origin: [
//             "http://localhost:5173",
//             "http://localhost:3000",
//             "http://localhost:3001",
//         ],
//         credentials: true,
//     })
// );

// app.use(express.json());

// app.use(clerkMiddleware());

// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: path.join(__dirname, "tmp"),
//         createParentPath: true,
//         limits: {
//             fileSize: 10 * 1024 * 1024,
//         },
//     })
// );

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/songs", songRoutes);
// app.use("/api/albums", albumRoutes);
// app.use("/api/stats", statRoutes);

// // Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);

//     res.status(500).json({
//         message:
//             process.env.NODE_ENV === "production"
//                 ? "Internal Server Error"
//                 : err.message,
//         error: err.message,
//     });
// });

// // Start server
// httpServer.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     connectDB();
// });


import express from "express";
import dotenv from "dotenv";
import  { clerkMiddleware } from '@clerk/express'
import connectDB  from "./lib/db.js";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";




dotenv.config();



const app = express();
const __dirname=path.resolve();
const PORT=process.env.PORT;

const httpServer=createServer(app);
initializeSocket(httpServer)

app.use(cors(
    {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    credentials:true,
    }
));

app.use(express.json())
app.use(clerkMiddleware());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:path.join(__dirname,"tmp"),
    createParentPath:true,
    limits:{
        fileSize:10 * 1024 * 1024
    }
}))

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statRoutes);

//error handler
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({message:process.env.NODE_ENV==="production"? "Internal Server Error" : err.message, error: err.message});
})



httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})