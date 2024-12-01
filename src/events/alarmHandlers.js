const Schedule = require("../models/scheduleModel");
const User = require("../models/userModel");

const alarmHandlers = async (socket, { type, data }) => {
    try {
var deleteId;
        switch (type) {
            case "getAllAlarm":
                // for refresh alarm list
                const allAlarm = await User.findOne({
                    UUID: socket.user.UUID
                });
                socket.emit("getAllAlarmRes", { status: 200, message: "알람 조회 완료", data: allAlarm.userAlarm });
                break;
            case "deleteAlarm":
                deleteId = data.deleteId;
                await User.updateOne({ UUID: socket.user.UUID }, {
                    $pull: {
                        userAlarm: {
                            'UUID': deleteId
                        }
                    }
                });
                socket.emit("deleteAlarmRes", { status: 200, message: "알람 삭제 완료", data: deleteId });
                break;
            case "getAlarmInvite":
                const { alarmId } = data;

                const alarmInvite = await User.findOne({
                    userAlarm: {
                        $elemMatch: { UUID: alarmId }
                    }
                });

                const alarmData = alarmInvite.userAlarm.find((alarm) => alarm.UUID === alarmId);
                const creator = await User.findOne({
                    UUID: alarmData.schedule.tag[0]
                })
                delete alarmData.schedule.tag;
                socket.emit("alarmInviteRes", { status: 200, message: "알람-invite 조회 완료", data: { sch: alarmData, userName: creator.userName } });
                break;
            case "responseInvitation":
                const { invitationId, response } = data;
                console.log(invitationId, response);

                if (response == "accept") {
                    await Schedule.updateOne({
                        UUID: invitationId
                    }, {
                        $push: {
                            tag: socket.user.UUID
                        }
                    });
                }
                await User.updateOne({
                    UUID: socket.user.UUID
                }, {
                    $pull: {
                        userAlarm: {
                            'UUID': invitationId
                        }
                    }
                });

                socket.emit("responseInvitationRes", { status: 200, message: "알람-invite 확인 완료" });
                break;
            case "deleteAlarm":
                deleteId = data.deleteId;
                await User.updateOne({ UUID: socket.user.UUID }, {
                    $pull: {
                        userAlarm: {
                    'UUID': deleteId
                        }
                    }
                });
                socket.emit("deleteAlarmRes", { status: 200, message: "알람 삭제 완료", data: deleteId });
                break;
        }
    } catch (err) {
        console.error(err);
        socket.emit("alarmHandlersRes", { status: 500, message: "오류가 발생하였습니다.\n관리자에게 문의해주세요!" });
    }
};

module.exports = alarmHandlers;