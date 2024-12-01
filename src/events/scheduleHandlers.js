const Schedule = require("../models/scheduleModel");
const { v4 } = require("uuid");
const User = require("../models/userModel");

const scheduleHandler = async (socket, { type, data }) => {
  var schedule;
  try {
    switch (type) {
      // 일정 생성 CREATE
      case "create":
        var {
          scdTitle,
          scdLocation,
          startDate,
          endDate,
          tag,
          color,
          calendarName,
          scdContent,
          scdAlarm,
        } = data;

        var scheduleData = {
          scdTitle,
          scdLocation,
          startDate,
          endDate,
          tag: [socket.user.UUID],
          calendarName,
          scdContent,
          scdAlarm,
          color,
          UUID: v4(),
        }
        const newSchedule = new Schedule(scheduleData);

        await newSchedule.save();

        for (let i = 0; i < tag.length; i++) {
          const [userName, userTag] = tag[i].split("#");

          const user = await User.findOne({ userName, userTag });

          if (user?.UUID == socket.user.UUID || !user?.UUID) continue;

          const newAlarm = {
            alarmType: "invite",
            UUID: v4(),
            createdAt: new Date(),
            content: scdTitle,
            schedule: scheduleData,
          };

          await User.updateOne({ UUID: user.UUID }, {
            $push: {
              userAlarm: newAlarm
            }
          });

          global.io.to(user.UUID).emit("newAlarmRes", {
            status: 200,
            message: "일정에 초대되었습니다.",
            data: newAlarm
          });
        };

        socket.emit("createScheduleRes", {
          status: 201,
          message: "일정 생성이 완료되었습니다.",
          data: newSchedule,
        });

        const newAlarm = {
          alarmType: 'alarm',
          UUID: v4(),
          createdAt: new Date(),
          content: scdTitle
        };

        await User.updateOne({ UUID: socket.user.UUID }, { $push: { userAlarm: newAlarm } });

        socket.emit("newAlarmRes", {
          status: 200,
          message: "새로운 일정이 생성되었습니다.",
          data: newAlarm
        });
        break;

      // 일정 한달 조회 READ
      case "readMonth":
        var { startDate, endDate } = data;
        const schedules = await Schedule.find({
          tag: { $in: [socket.user.UUID] },
          startDate: { $gte: startDate, $lte: endDate },
        });

        var scheduleDatas = [];
        for (let i = 0; i < schedules.length; i++) {
          const scheduleData = schedules[i];
          for (let j = 0; j < schedules[i].tag.length; j++) {
            const user = await User.findOne({ UUID: schedules[i].tag[j] });
            scheduleData.tag[j] = user.userName + "#" + user.userTag;
          }
          scheduleDatas.push(scheduleData);
        }

        socket.emit("readMonthScheduleRes", {
          status: 200,
          message: "일정 조회를 완료했습니다.",
          data: scheduleDatas,
        });
        break;
      // 일정 수정 UPDATE
      case "update":
        var {
          updateScdTitle,
          updateScdLocation,
          updateStartDate,
          updateEndDate,
          updateTag,
          updateCalendarName,
          updateScdContent,
          updateScdAlarm,
          UUID
        } = data;
        // 수정사항 있는 것만 업데이트에 추가
        const updateFields = {};
        if (updateScdTitle !== undefined)
          updateFields.scdTitle = updateScdTitle;
        if (updateScdLocation !== undefined)
          updateFields.scdLocation = updateScdLocation;
        if (updateStartDate !== undefined)
          updateFields.startDate = updateStartDate;
        if (updateEndDate !== undefined) updateFields.endDate = updateEndDate;
        if (updateTag !== undefined) updateFields.tag = updateTag;
        if (updateCalendarName !== undefined)
          updateFields.calendarName = updateCalendarName;
        if (updateScdContent !== undefined)
          updateFields.scdContent = updateScdContent;
        if (updateScdAlarm !== undefined)
          updateFields.scdAlarm = updateScdAlarm;
        if (Object.keys(updateFields).length === 0) {
          socket.emit("updateScheduleRes", {
            status: "error",
            message: "수정사항이 없습니다.",
          });
          break;
        };

        schedule = await Schedule.findOne({ UUID });
        if (!schedule) {
          socket.emit("updateScheduleRes", {
            status: 404,
            message: "일정을 찾을 수 없습니다.",
          });
        };

        for (let i = 0; i < updateFields.tag.length; i++) {
          const [userName, userTag] = updateFields.tag[i].split("#");
          const user = await User.findOne({ userName, userTag });
          if (!user) continue;

          updateFields.tag[i] = user.UUID;
        };

        for (let i = 0; i < schedule.tag.length; i++) {
          if (!updateFields.tag.includes(schedule.tag[i])) {
            const user = await User.findOne({ UUID: schedule.tag[i] });
            if (!user) continue;
            const newAlarm = {
              alarmType: "alarm",
              UUID: v4(),
              createdAt: new Date(),
              content: "일정(" + schedule.scdTitle + ")이 " + socket.user.userName + "#" + socket.user.userTag + "님에 의해 일정에서 제외되었습니다.",
            };
            await User.updateOne({ UUID: user.UUID }, {
              $push: {
                userAlarm: newAlarm
              }
            });

            global.io.to(user.UUID).emit("newAlarmRes", {
              status: 200,
              message: "일정이 업데이트된 완료된 일정이 삭제되었습니다.",
              data: newAlarm
            });
          }
        }

        for (let i = 0; i < updateFields.tag.length; i++) {
          if (!schedule.tag.includes(updateFields.tag[i])) {
            const user = await User.findOne({ UUID: updateFields.tag[i] });
            if (!user) continue;
            const newAlarm = {
              alarmType: "invite",
              UUID: v4(),
              createdAt: new Date(),
              content: schedule.scdTitle,
              schedule: updateFields,
            };
            await User.updateOne({ UUID: user.UUID }, {
              $push: {
                userAlarm: newAlarm
              }
            });
            updateFields.tag.splice(i, 1);

            global.io.to(user.UUID).emit("newAlarmRes", {
              status: 200,
              message: "일정에 초대되었습니다.",
              data: newAlarm
            });
          }
        }
        const updatedSchedule = await Schedule.findOneAndUpdate(
          { UUID },
          { $set: updateFields },
          { new: true }
        );
        if (!updatedSchedule) {
          socket.emit("updateScheduleRes", {
            status: 404,
            message: "일정을 찾을 수 없습니다.",
          });
        } else {
          socket.emit("updateScheduleRes", {
            status: 200,
            message: "일정 수정이 완료되었습니다.",
            data: updatedSchedule,
          });
          for (let i = 0; i < updateFields.tag.length; i++) {
            const user = await User.findOne({ UUID: updateFields.tag[i] });
            if (!user) continue;
            const newAlarm = {
              alarmType: "alarm",
              UUID: v4(),
              createdAt: new Date(),
              content: "일정(" + updateFields.scdTitle + ")이 " + socket.user.userName + "#" + socket.user.userTag + "님에 의해 업데이트 되었습니다.",
            };
            await User.updateOne({ UUID: user.UUID }, {
              $push: {
                userAlarm: newAlarm
              }
            });

            global.io.to(user.UUID).emit("newAlarmRes", {
              status: 200,
              message: "일정이 업데이트 되었습니다.",
              data: newAlarm
            });
          }
        }
        break;

      // 일정 삭제 DELETE
      case "delete":
        var { UUID } = data;
        schedule = await Schedule.findOne({ UUID });
        if (!schedule) {
          socket.emit("deleteScheduleRes", {
            status: 404,
            message: "일정을 찾을 수 없습니다.",
          });
        } else if (schedule.tag.length == 1 || schedule.tag[0] == socket.user.UUID) {
          await Schedule.findOneAndDelete({ UUID });
          socket.emit("deleteScheduleRes", {
            status: 200,
            message: "일정 삭제가 완료되었습니다.",
          });
        } else {
          await Schedule.findOneAndUpdate(
            { _id: UUID, "tag.UUID": socket.user.UUID },
            { $pull: { tag: socket.user.UUID } }
          );
          socket.emit("deleteScheduleRes", {
            status: 200,
            message: "일정 삭제가 완료되었습니다.",
          });
        }

        for (let i = 0; i < schedule.tag.length; i++) {
          const user = await User.findOne({ UUID: schedule.tag[i] });
          if (!user) continue;
          const newAlarm = {
            alarmType: "alarm",
            UUID: v4(),
            createdAt: new Date(),
            content: "일정(" + schedule.scdTitle + ")이 " + socket.user.userName + "#" + socket.user.userTag + "님에 의해 삭제되었습니다.",
          };
          await User.updateOne({ UUID: user.UUID }, {
            $push: {
              userAlarm: newAlarm
            }
          });

          global.io.to(user.UUID).emit("newAlarmRes", {
            status: 200,
            message: "일정이 삭제되었습니다.",
            data: newAlarm
          });
        };

        break;
      default:
        socket.emit("scheduleRes", {
          status: 400,
          message: "유효하지 않은 타입입니다.",
        });
    }
  } catch (err) {
    console.error(err);
    socket.emit("createScheduleRes", {
      status: 500,
      message: "서버에서 오류가 발생했습니다.",
    });
  }
};

module.exports = scheduleHandler;
