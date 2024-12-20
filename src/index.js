const express = require("express");
const { createServer } = require("http");
const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const Schedule = require("./models/scheduleModel");
const cron = require("node-cron");
const io = new Server(httpServer, {
    pingInterval: 5000,
    pingTimeout: 120000,
    path: "/api/socket.io",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
global.io = io;

app.get("/api/", (req, res) => {
    res.sendFile(__dirname + "/test/index.html");
});

io.on("connection", async (socket) => {
    console.log(socket.id + "is connected");

    const events = readdirSync("./events");
    events.forEach((file) => {
        const event = require("./events/" + file);
        socket.on(file.replace(".js", ""), (data) => {
            event(socket, data);
        });
    });
});

const schedules = await Schedule.find({ startDate: { $gte: startDate } });

function timestampToCron(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${minutes} ${hours} * * *`;
}

schedules.forEach((schedule) => {
    cron.schedule(timestampToCron(schedule.scdAlarm), async () => {
        schedule.tag.forEach((tag) => {
            io.to(tag).emit("newAlarmRes", schedule);
        });
    });
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
