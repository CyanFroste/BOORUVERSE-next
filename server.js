const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const config = require("./config.json");

const port = process.env.PORT || config.PORT;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// dropped because...
/* 
events.js:292
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (net.js:1313:16)
    at listenInCluster (net.js:1361:12)
    at Server.listen (net.js:1447:7)
    at E:\WORK\BOORUVERSE-V3.0.0\.next\server\pages\api\posts.js:300:10
Emitted 'error' event on Server instance at:
    at emitErrorNT (net.js:1340:8)
    at processTicksAndRejections (internal/process/task_queues.js:84:21) {
  code: 'EADDRINUSE',
  errno: 'EADDRINUSE',
  syscall: 'listen',
  address: '::',
  port: 3000
}
*/
// while trying to broadcast


io.on("connection", (socket) => {
	console.log("connected to", socket.id);
});

nextApp.prepare().then(() => {
	app.get("*", (req, res) => {
		return nextHandler(req, res);
	});
	app.post("*", (req, res) => {
		return nextHandler(req, res);
	});

	server.listen(port, (err) => {
		if (err) {
			console.error(err);
			throw err;
		}
		console.log(`> Ready on http://localhost:${port}`);
	});
});

function broadcast(name, data) {
	io.sockets.emit(name, data);
}

module.exports = { broadcast };
