const mongoose = require("mongoose");

/**
 * 일기 데이터 모델
 * UUID : 일기 구분용 고유키
 * diaryTitle : 일기 제목
 * diaryLocation : 일기 장소
 * diaryDate : 일기 날짜
 * diaryContent : 일기 내용
 * createUser : 일기 생성자 UUID
 */

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
  createUser: {
    // 생성자
    type: String,
    required: true,
  },
});

const Diary = mongoose.model("Diary", diarySchema);
module.exports = Diary;
