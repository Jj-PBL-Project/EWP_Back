const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // 비밀번호 암호화

const signup = async (req, res) => {
  const { userName, userBirthday, userId, userPassword } = req.body;
  try {
    // 비밀번호 암호화
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(userPassword, salt);

    // 유저 데이터 생성 및 저장
    const newUser = new User({
      userName,
      userBirthday,
      userId,
      userPassword: hashPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Sign Up Success" });
  } catch (err) {
    res.status(201).json({ message: err.message });
  }
};

module.exports = { signup };
