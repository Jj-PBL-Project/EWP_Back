const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the Page");
});

app.listen(80, () => {
    console.info("Server listening on port 80");
});