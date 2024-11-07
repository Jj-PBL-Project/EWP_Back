const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the Page");
});

app.get("/test", (req, res) => {
    res.sendFile(__dirname + "/page/index.html");
});

app.listen(80, () => {
    console.log("Server listening on port 80");
});