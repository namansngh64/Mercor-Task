require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const server = app.listen(5000, () => {
  console.log("Server running at port 5000");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("chat message", (text) => {
    console.log(`Message: ${text}`);
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "user",
            content: `${text}`
          }
        ]
      })
      .then((res) => {
        socket.emit("bot reply", res.data.choices[0].message.content);
      })
      .catch((err) => {
        socket.emit("bot reply", "");
        console.log(err);
      });
  });
});

module.exports = app;
