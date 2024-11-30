const Schedule = require("../models/scheduleModel");

const createSchedule = async (socket, { type, data }) => {
  try {
    switch (type) {
      // 일정 생성 CREATE
      case "create":
        const {
          scdTitle,
          isImportant,
          scdLocation,
          startDate,
          endDate,
          tag,
          calendarName,
          scdContent,
          scdAlarm,
        } = data;
        const newSchedule = new Schedule({
          scdTitle,
          isImportant,
          scdLocation,
          startDate,
          endDate,
          tag,
          calendarName,
          scdContent,
          scdAlarm,
          UUID: socket.user.UUID,
        });
        await newSchedule.save();
        socket.emit("createScheduleRes", {
          status: 201,
          message: "일정 생성이 완료되었습니다.",
          data: newSchedule,
        });
        break;

      // 일정 한달 조회 READ
      case "readMonth":
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const schedules = await Schedule.find({
          UUID: socket.user.UUID,
          startDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        });


        socket.emit("readMonthScheduleRes", {
          status: 200,
          message: "일정 조회를 완료했습니다.",
          data: schedules,
        });
        break;

      // 선택 일정 조회 READ
      case "read":
        const { readId } = data;
        const schedule = await Schedule.findById(readId);
        if (!schedule) {
          socket.emit("readScheduleRes", {
            status: 404,
            message: "해당 일정을 찾을 수 없습니다.",
          });
        } else {
          socket.emit("readScheduleRes", {
            status: 200,
            message: "일정 조회를 완료했습니다.",
            data: schedule,
          });
        }
        break;

      // 일정 수정 UPDATE
      case "update":
        const {
          updateId,
          updateScdTitle,
          updateIsImportant,
          updateScdLocation,
          updateStartDate,
          updateEndDate,
          updateTag,
          updateCalendarName,
          updateScdContent,
          updateScdAlarm,
        } = data;
        // 수정사항 있는 것만 업데이트에 추가
        const updateFields = {};
        if (updateScdTitle !== undefined)
          updateFields.scdTitle = updateScdTitle;
        if (updateIsImportant !== undefined)
          updateFields.isImportant = updateIsImportant;
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
        }
        const updatedSchedule = await Schedule.findByIdAndUpdate(
          updateId,
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
        }
        break;

      // 일정 삭제 DELETE
      case "delete":
        const { deleteId } = data;
        const deleteSchedule = await Schedule.findByIdAndDelete(deleteId);
        if (!deleteSchedule) {
          socket.emit("deleteScheduleRes", {
            status: 404,
            message: "해당 일정을 찾을 수 없습니다.",
          });
        } else {
          socket.emit("deleteScheduleRes", {
            status: 200,
            message: "일정 삭제가 완료되었습니다.",
          });
        }
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

module.exports = createSchedule;
