const mongoose = require("mongoose");

/*
scheduleTitle < 이렇게 풀명칭으로 할지
scdTitle < 이렇게 줄임으로 할지
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
  /* 
        schAlarm
        figma를 보니 ex)10분전 이렇게 입력을 하는 것 같은데
        DB에 집어넣을때 endDate에서 해당시간 계산해서 넣어주면 될 것 같습니다
    */
  scdAlarm: {
    // 알림
    type: Date,
    required: true,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
