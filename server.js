const express = require('express'); // Importa express
const path = require('path'); // Importa path para manejar rutas de archivos
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));
io.on("connection", function(socket){
	socket.on("newuser", function(username){	
		socket.broadcast.emit("update", username + " join the conversation");
	});
	socket.on("exituser", function(username){
		socket.broadcast.emit("update", username + " left the conversation");
	});
	socket.on("chat", function(message){
		socket.broadcast.emit("chat", message);
	});
});

server.listen(5500, () => {
  console.log('Server is running on port 5500');
});