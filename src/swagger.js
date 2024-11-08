const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "0.1.0",
            title: "EWP(Easy Web Planner)",
            description:
                "웹 일정 관리 프로젝트",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routers/*.js", "./routers/user/*.js"],
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }