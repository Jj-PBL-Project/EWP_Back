const express = require("express");
const router = express.Router();
const user = require("./User");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 데이터 관리 라우터
 */
router.use("/User", user);

module.exports = router;
