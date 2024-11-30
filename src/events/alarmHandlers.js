const User = require("../models/userModel");

const alarmHandlers = async (socket, { type, data }) => {
    try {
        switch (type) {
            case "getAllAlarm":
                // for refresh alarm list
                const allAlarm = await User.findOne({
                    UUID: socket.user.UUID
                });
                socket.emit("getAllAlarmRes", { status: 200, message: "알람 조회 완료", data: allAlarm.userAlarm });
                break;
            case "deleteAlarm":
                const { deleteId } = data;
                await User.updateOne({ UUID: socket.user.UUID }, { $pull: { userAlarm: {
                    'UUID': deleteId
                } } });
                socket.emit("deleteAlarmRes", { status: 200, message: "알람 삭제 완료", data: deleteId });
                break;
        }
    } catch (err) {
        console.error(err);
        socket.emit("alarmHandlersRes", { status: 500, message: "오류가 발생하였습니다.\n관리자에게 문의해주세요!" });
    }
};

module.exports = alarmHandlers;