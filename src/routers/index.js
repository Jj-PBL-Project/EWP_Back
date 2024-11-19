const router = require("express").Router();

const API = (io) => {
    const user = require("./User")(io);
    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: 유저 데이터 관리 라우터
     */
    router.use("/user", user);
    return router;
}

module.exports = API;