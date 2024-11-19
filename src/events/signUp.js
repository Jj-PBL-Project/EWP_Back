const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // 비밀번호 암호화
const { v4 } = require("uuid");

const signup = async (socket, { userName, userBirthday, userId, userPassword }) => {
    try {
        // 비밀번호 암호화
        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(userPassword, salt);

        const existingUserName = await User.find({ userName });

        const generateTag = async () => {
            let tag = (Math.floor(Math.random() * 9999) + 1).toString().padStart(4, '0');
            if (existingUserName.some(user => user.userTag === tag)) {
                return generateTag();
            }
            return tag;
        }

        // 유저 데이터 생성 및 저장
        const newUser = new User({
            userName,
            userBirthday,
            userId,
            userPassword: hashPassword,
            UUID: v4(),
            userTag: await generateTag()
        });
        await newUser.save();
        socket.emit("signUpRes", { status: 201, message: "계정 생성이 완료되었습니다." });
    } catch (err) {
        console.error(err);
        socket.emit("signUpRes", { status: 500, message: "서버에서 오류가 발생했습니다." });
    }
};

module.exports = signup;