const getUserInfo = async (socket) => {
    try {
        if (socket.user) return socket.emit("getUserInfoRes", { status: 200, message: socket.user });
        socket.emit("getUserInfoRes", { status: 400, message: "아직 당신은 로그인하지 않았습니다." });
    } catch (err) {
        console.error(err);
        socket.emit("getUserInfoRes", { status: 500, message: "오류가 발생하였습니다.\n관리자에게 문의해주세요!" });
    }
};

module.exports = getUserInfo;