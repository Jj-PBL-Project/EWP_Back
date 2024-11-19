const express = require('express');
const { createServer } = require('http');
const { swaggerUi, specs } = require("./swagger");
const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const io = new Server(httpServer, {
    pingInterval: 5000,
    pingTimeout: 120000
});
const api = require("./routers")(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

io.on("connection", (socket) => {
    console.log(socket.id + "is connected");
});

mongoose
    .connect("mongodb://localhost:27017/ewp_test")
    .then(() => {
        console.log("ewp_test DB에 연결 성공!");
    })
    .catch((err) => {
        throw new Error("데이터베이스 연결에 실패했습니다.");
    });

httpServer.listen(3000, () => {
    console.log("Server listening on port 3000");
});