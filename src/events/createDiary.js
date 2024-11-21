const Diary = require("../models/diaryModel");

const createDiary = async (
  socket,
  { diaryTitle, diaryLocation, diaryDate, diaryContent }
) => {
  try {
    // 일기 생성 및 저장
    const newDiary = new Diary({
      diaryTitle,
      diaryLocation,
      diaryDate,
      diaryContent,
      UUID: socket.user.UUID,
    });
    await newDiary.save();
    socket.emit("createDiaryRes", {
      status: 201,
      message: "일기 생성이 완료되었습니다.",
    });
  } catch (err) {
    console.error(err);
    socket.emit("createDiaryRes", {
      status: 500,
      message: "서버에서 오류가 발생했습니다.",
    });
  }
};

module.exports = createDiary;
