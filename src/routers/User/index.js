const express = require("express");
const router = express.Router();
const { signup } = require("../../controllers/signupController");

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
router.get("/test", (req, res) => {
  res.status(200).json({
    ok: true,
  });
});

module.exports = router;
