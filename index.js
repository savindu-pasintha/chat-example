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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/aa', (req, res) => {
  res.send("savindu pasintha-"+req.body);
});



io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
