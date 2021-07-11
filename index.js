const app = require('express')();
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server,{
  cors: {
		origin: '*',
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true
	 }
}
);

const port = process.env.PORT || 3000;

var con , dcon , call, answer , error, canvas , chat = [] ;
io.on('connection', (socket) => {
 	console.log('Client connected');

	socket.on('disconnect', () => {console.log('Client disconnected'); con = "connected"});

	socket.emit("me", socket.id);
	
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
		dcon ="dis connected";
	});

	socket.on("connect_error", (err) => {
		console.log(`connect_error due to ${err.message}`);
		error = err.message;
	  });

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
        call =" -call-> " + data.userToCall + " -signal-> " + data.signalData + " -from-> " + data.from + "-name-> " + data.name;
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal);
		answer = " -To-> " + data.to + " -signal-> " + data.signal;
	});

	socket.on('canvas-data', (getDataFromClient) => {
		socket.broadcast.emit('canvas-data',getDataFromClient);
		canvas = getDataFromClient;
     });

	socket.on('chat message',(msg)=> {
		io.emit('chat message', msg);
		chat.push(msg);
	  });
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

 app.get('/a', (req, res) => {
	res.send("./"+  req.body +
    "\n" + "connection-" +	con + "-disconnect-" + dcon + 
	    "\n" + "call data-" + call +  
		 "\n"+ "answer data- " + answer + 
		  "\n"+ "chat data- "+ chat
	);
	
  });
server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
