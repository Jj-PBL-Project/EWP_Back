const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
});

export const User = mongoose.model("User", userSchema);
