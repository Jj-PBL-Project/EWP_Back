const router = require("express").Router();
const { signup } = require("../../controllers/signupController");
const { login } = require("../../controllers/loginController");

const USER = (io) => {
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
  
  /**
   * @swagger
   * paths:
   *  /api/user/signup:
   *    post:
   *      summary: "계정 생성"
   *      description: "서버에 사용자 정보를 보내 계정을 생성합니다."
   *      tags: [Users]
   *      requestBody:
   *       content:
   *          application/json:
   *              required: true
   *              description: user token and memo info
   *              schema:
   *                type: object
   *                properties:
   *                   userName:
   *                       type: string
   *                       example: 홍길동
   *                   userBirthday:
   *                       type: string
   *                       example: 2003-03-10
   *                   userId:
   *                      type: string
   *                      example: testId
   *                   userPassword:
   *                       type: string
   *                       example: admin1234
   *      responses:
   *        "201":
   *          description: 유저 계정 생성 성공
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                    message:
   *                      type: String
   *                      example: Sign Up Success
   *        "400":
   *          description: 유저 계정 생성 실패
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                    message:
   *                      type: String
   *                      example: Error Message
   */
  router.post("/signup", signup);
  
  /**
   * @swagger
   * paths:
   *  /api/user/login:
   *    post:
   *      summary: "로그인"
   *      description: "서버에 사용자 정보를 보내 계정을 로그인합니다"
   *      tags: [Users]
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                userId:
   *                  type: string
   *                  example: testId
   *                userPassword:
   *                  type: string
   *                  example: admin1234
   *      responses:
   *        "200":
   *          description: 유저 로그인 성공
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Login Success
   *        "400":
   *          description: 유저 로그인 실패
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Check userID or userPassword
   *        "500":
   *          description: 서버 오류
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    example: Server Error
   */
  router.post("/login", login);

  return router;
}

module.exports = USER;