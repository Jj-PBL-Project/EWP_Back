const express = require("express");
const app = express();
const { swaggerUi, specs } = require("./swagger");
const api = require("./routers");
const mongoose = require("mongoose");
const authRoutes = require("./routers/authRoutes");

// DB 연결
mongoose
  .connect("mongodb://localhost:27017/ewp_test")
  .then(() => {
    console.log("ewp_test DB에 연결 성공!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/auth", authRoutes);

app.listen(80, () => {
  console.info("Server listening on port 80");
});
