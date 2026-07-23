const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/user");
const Admin = require("./models/admin");
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const http = require("http");
const { Server } = require("socket.io");

console.log("JWT_SECRET =", process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.set("socketio", io);


const socketToUserMap = new Map();
const onlineUsers = new Map();


process.on("uncaughtException", (err) => {

    logger.error(err);

    process.exit(1);

});

process.on("unhandledRejection", (err) => {

    logger.error(err);

    process.exit(1);

});

const startServer = async () => {

  try {

    // Connect MongoDB first

    await connectDB();

    const mongoose = require("mongoose");
    console.log("Database:", mongoose.connection.name);
    console.log("Users:", await User.countDocuments({}));
    console.log("Admins:", await Admin.countDocuments({}));

    // Reset users after DB connection

    await User.updateMany(
      {},
      {
        isOnline: false,
        socketId: null,
      }
    );


    console.log(
      "Reset all online users to offline on startup."
    );



    // Start socket only after DB

    io.on("connection", (socket) => {

      console.log(
        "User connected:",
        socket.id
      );


      socket.on(
        "user_online",
        async(userId)=>{


          socket.userId = userId;


          if(!onlineUsers.has(userId)){
            onlineUsers.set(
              userId,
              new Set()
            );
          }


          onlineUsers
          .get(userId)
          .add(socket.id);



          await User.findByIdAndUpdate(
            userId,
            {
              isOnline:true,
              socketId:socket.id,
              lastSeen:new Date()
            }
          );


          io.emit(
            "active_users_count",
            onlineUsers.size
          );


        }
      );



      socket.on(
        "disconnect",
        async()=>{


          if(socket.userId){

            const sockets =
              onlineUsers.get(
                socket.userId
              );


            if(sockets){

              sockets.delete(
                socket.id
              );


              if(sockets.size===0){

                onlineUsers.delete(
                  socket.userId
                );


                await User.findByIdAndUpdate(
                  socket.userId,
                  {
                    isOnline:false,
                    socketId:null,
                    lastSeen:new Date()
                  }
                );

              }

            }


            io.emit(
              "active_users_count",
              onlineUsers.size
            );

          }

        }
      );


    });



    server.listen(
      PORT,
      ()=>{
        console.log(
          `Server Running On Port ${PORT}`
        );
      }
    );


  }
  catch(error){

    console.log(
      "Server startup failed:",
      error.message
    );

    process.exit(1);

  }

};


startServer();