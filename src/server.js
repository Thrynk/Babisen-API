const io = require("./serverIO");


io.on("connection", socketIO);

async function socketIO(socket){
    console.log("New client connected , id :" + socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
}


