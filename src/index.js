const express = require("express");
const app = express();
const { swaggerUi, specs } = require("./swagger");
const api = require("./routers");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.get("/", (req, res) => {
    res.send("Welcome to the Page");
});

app.listen(80, () => {
    console.info("Server listening on port 80");
});