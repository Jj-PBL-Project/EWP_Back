const express = require("express");
const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/user/test:
 *    get:
 *      summary: "API 테스트를 위한 기능"
 *      description: "서버에 데이터를 보내지 않고 POST방식으로 요청"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 */
router.post("/", (req, res) => {
  res.status(200).json({
    ok: true,
  });
});

router.get("/", (req, res) => {
  res.send("./routers/User/index.js 입니다.");
});

module.exports = router;
