const Diary = require("../models/diaryModel");

const diaryHandlers = async (socket, { type, data }) => {
  try {
    console.log("서버로넘어왔다");
    console.log(type, data);
    switch (type) {
      // 일기 생성 및 저장 CREATE
      case "create":
        const { diaryTitle, diaryLocation, diaryDate, diaryContent } = data;
        console.log("diaryHandlers.js : ", {
          diaryTitle,
          diaryLocation,
          diaryDate,
          diaryContent,
        });
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
        break;

      // 일기 전체 조회 READ
      case "readAll":
        const diaries = await Diary.find();
        socket.emit("readAllDiaryRes", {
          status: 200,
          message: "일기 조회를 완료했습니다.",
          data: diaries,
        });
        break;

      // 사용자가 선택한 일기 조회 READ
      case "read":
        const { readId } = data;
        console.log("서버>클라로 넘겨준 readId", readId);
        const diary = await Diary.findById(readId);

        if (!diary) {
          socket.emit("readDiaryRes", {
            status: 404,
            message: "해당 일기를 찾을 수 없습니다.",
          });
        } else {
          socket.emit("readDiaryRes", {
            status: 200,
            message: "일기 조회를 완료했습니다.",
            data: diary,
          });
        }
        break;

      // 일기 수정 UPDATE
      case "update":
        const { updateId, updateDiaryTitle, updateDiaryContent } = data;
        // 수정 사항만 추가
        const updateFields = {};
        if (updateDiaryTitle !== undefined)
          updateFields.diaryTitle = updateDiaryTitle;
        if (updateDiaryContent !== undefined)
          updateFields.diaryContent = updateDiaryContent;

        if (Object.keys(updateFields).length === 0) {
          socket.emit("updateDiaryRes", {
            status: "error",
            message: "수정사항이 없습니다.",
          });
          break;
        }

        const updateDiary = await Diary.findByIdAndUpdate(
          updateId,
          updateFields,
          { new: true }
        );
        if (!updateDiary) {
          socket.emit("updateDiaryRes", {
            status: 404,
            message: "일기를 찾을 수 없습니다.",
          });
        } else {
          socket.emit("updateDiaryRes", {
            status: 200,
            message: "일기 수정이 완료되었습니다.",
            data: updateDiary,
          });
        }
        break;

      // 일기 삭제 DELETE
      case "delete":
        const { deleteId } = data;
        const deleteDiary = await Diary.findOneAndDelete(deleteId);

        if (!deleteDiary) {
          socket.emit("deleteDiaryRes", {
            status: 404,
            message: "일기를 찾을 수 없습니다.",
          });
        } else {
          socket.emit("deleteDiaryRes", {
            status: 200,
            message: "일기 삭제가 완료되었습니다.",
          });
        }
        break;

      default:
        socket.emit("diaryRes", {
          status: 400,
          message: "유효하지 않은 타입입니다.",
        });
        break;
    }
  } catch (err) {
    console.error(err);
    socket.emit("diaryRes", {
      status: 500,
      message: "서버에서 오류가 발생했습니다.",
    });
  }
};

module.exports = diaryHandlers;
