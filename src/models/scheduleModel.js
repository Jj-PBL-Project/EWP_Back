const mongoose = require("mongoose");

/**
 * 일정 데이터 모델
 * UUID : 일정 구분용 고유키
 * scdTitle : 일정 제목
 * isImportant : 중요 체크박스
 * scdLocation : 일정 장소
 * startDate : 일정 시작일시
 * endDate : 일정 종료일시
 * tag : 일정 참석자
 * - 참석자들의 UUID들을 배열로 저장
 * calendarName : 일정 캘린더
 * scdContent : 일정 설명
 */

const scheduleSchema = new mongoose.Schema({
  UUID: {
    // 외래키
    type: String,
    required: true
  },
  scdTitle: {
    // 제목
    type: String,
    required: true,
  },
  isImportant: {
    // 중요 체크박스
    type: Boolean,
    dafault: false,
  },
  scdLocation: {
    // 장소
    type: String,
    required: true,
  },
  startDate: {
    // 시작일시
    type: Date,
    required: true,
  },
  endDate: {
    // 종료일시
    type: Date,
    required: true,
  },
  tag: {
    // 참석자
    // 참석자의 태그값만 POST로 넘겨주는건가요?
    type: [String], // 배열 필드
    required: true,
  },
  calendarName: {
    // 캘린더
    type: String,
    required: true,
  },
  scdContent: {
    // 설명
    type: String,
    // 일정추가 시 제목만 적어서 기록하는 경우도 있어서
    // required 속성 뺐습니다
  },
  scdAlarm: {
    // 알림
    type: Date,
    required: true,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
