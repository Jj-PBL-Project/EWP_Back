const User = require("../models/userModel");

const checkUserId = async (socket, { userId }) => {
    try {
        if (!userId) return socket.emit("checkUserIdRes", { status: 400, message: "잘못된 요청입니다." });
        const existingUserId = await User.find({ userId });

        if (existingUserId) return socket.emit("checkUserIdRes", { status: 401, message: "이미 사용중인 아이디입니다." });

        socket.emit("checkUserIdRes", { status: 200, message: "사용 가능한 아이디입니다." });
    } catch (err) {
        console.error(err);
        socket.emit("checkUserIdRes", { status: 500, message: "오류가 발생하였습니다.\n관리자에게 문의해주세요!" });
    }
};

module.exports = checkUserId;