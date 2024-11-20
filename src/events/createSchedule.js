const Schedule = require("../models/scheduleModel");
const { v4 } = require("uuid");

const createSchedule = async (
  socket,
  {
    scdTitle,
    isImportant,
    scdLocation,
    startDate,
    endDate,
    tag,
    calendarName,
    scdContent,
    scdAlarm,
  }
) => {
  try {
    // 일정 생성 및 저장
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
      UUID: v4(),
    });
    await newSchedule.save();
    socket.emit("createScheduleRes", {
      status: 201,
      message: "일정 생성이 완료되었습니다.",
    });
  } catch (err) {
    console.error(err);
    socket.emit("createScheduleRes", {
      status: 500,
      message: "서버에서 오류가 발생했습니다.",
    });
  }
};

module.exports = createSchedule;
