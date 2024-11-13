const mongoose = require("mongoose");

/*
scheduleTitle < 이렇게 풀명칭으로 할지
scdTitle < 이렇게 줄임으로 할지
*/
const scheduleSchema = new mongoose.Schema({
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
  date:
  {
    start: {
      // 시작일시
      type: Date,
      required: true,
    },
    end: {
      // 종료일시
      type: Date,
      required: true,
    }
  },
  tag: {
    // 참석자
    type: [String], // 배열 필드
    required: true
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
  schAlarm:  {
    type: String,
    required: true
  }
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
