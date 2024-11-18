const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
  UUID: {
    // 외래키
    type: String,
    required: true
  },
  diaryTitle: {
    // 제목
    type: String,
    required: true,
  },
  diaryLocation: {
    // 장소
    type: String,
    required: true,
  },
  diaryDate: {
    // 날짜
    type: Date,
    required: true,
  },
  diaryContent: {
    // 내용
    type: String,
    required: true,
  },
});

const Diary = mongoose.model("Diary", diarySchema);
module.exports = Diary;
