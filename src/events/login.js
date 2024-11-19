const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const LOGIN = async (socket, { userId, userPassword }) => {
    try {
        console.log(userId, userPassword);
        if (!userId || !userPassword) return socket.emit("loginRes", { status: 400, message: "아이디 또는 비밀번호를 확인해주세요" });
        const user = await User.findOne({ userId });
        const isMatch = await bcrypt.compare(userPassword, user?.userPassword);
        if (!user || !isMatch) return socket.emit("loginRes", { status: 400, message: "아이디 또는 비밀번호를 확인해주세요" });

        socket.emit("loginRes", {
            status: 200,
            message: "로그인 성공",
        });
        socket.user = user;
    } catch (err) {
        console.error(err);
        socket.emit("loginRes", { status: 500, message: "오류가 발생하였습니다.\n관리자에게 문의해주세요!" });
    }
};

module.exports = LOGIN;