const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const app = express();
const port = process.env.PORT || 9000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatapparchit.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const students = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
];

const messages = [];

app.use(bodyParser.json());
app.use(
  cors({ origin: "https://chatapparchit.netlify.app", credentials: true })
);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (message) => {
    messages.push(message);

    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
