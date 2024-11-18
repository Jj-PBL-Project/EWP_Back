const mongoose = require("mongoose");

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
    required: true
  },
  userProfileImgUrl: {
    // 프로필 사진
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
