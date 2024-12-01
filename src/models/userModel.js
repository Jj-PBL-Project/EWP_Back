const mongoose = require("mongoose");

/**
 * 유저 데이터 모델
 * UUID : 유저 구분용 고유키
 * userName : 유저 이름
 * userBirthday : 생년월일
 * userId : 아이디
 * userPassword : 비밀번호
 * userTag : 태그
 * userBio : 상태메세지
 * userProfileImgUrl : 프로필 사진
 * userAlarm : 알람리스트
 * - alarmType : 알람 타입
 * - UUID : 알람 구분용 고유키
 * - createdAt : 알람 생성 시간
 */

const userSchema = new mongoose.Schema({
  UUID: {
    // 외래키
    type: String,
    required: true
  },
  userName: {
    // 이름
    type: String,
    required: true,
  },
  userBirthday: {
    // 생년월일
    type: Date,
    required: true,
  },
  userId: {
    // 아이디
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    // 비밀번호
    type: String,
    required: true,
  },
  userTag: {
    // 태그
    type: String,
    required: true
  },
  userBio: {
    // 상태메세지
    type: String,
    required: false
  },
  userProfileImgUrl: {
    // 프로필 사진
    type: String,
    required: false
  },
  userAlarm: {
    type: [{
      alarmType: {
        type: String,
        enum: ['alarm', 'invite'],
        required: true
      },
      UUID: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        required: true
      },
      content: {
        type: String,
        required: false
      },
      schedule: {
        type: {
          scdTitle: {
            type: String,
            required: true
          },
          scdLocation: {
            type: String,
            required: true
          },
          startDate: {
            type: Date,
            required: true
          },
          endDate: {
            type: Date,
            required: true
          },
          tag: {
            type: [String],
            required: true
          },
          calendarName: {
            type: String,
            required: true
          },
          scdContent: {
            type: String,
            required: true
          },
          scdAlarm: {
            type: Date,
            required: true
          },
          color: {
            type: String,
            required: true
          },
          UUID: {
            type: String,
            required: true
          }
        }
      }
    }],
    required: true
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
