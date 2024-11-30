const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // 비밀번호 암호화
const { v4 } = require("uuid");

const signup = async (socket, { userName, userBirthday, userId, userPassword }) => {
    try {
        if (!userName || !userBirthday || !userId || !userPassword) return socket.emit("signUpRes", { status: 400, message: "잘못된 요청입니다." });
        // 비밀번호 암호화
        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(userPassword, salt);

        const existingUserId = await User.find({ userId });

        if (existingUserId.length != 0) return socket.emit("signUpRes", { status: 401, message: "이미 사용중인 아이디입니다." });
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
            userTag: await generateTag(),
            userAlarm: []
        });
        await newUser.save();
        socket.emit("signUpRes", { status: 201, message: "계정 생성이 완료되었습니다." });
    } catch (err) {
        console.error(err);
        socket.emit("signUpRes", { status: 500, message: "서버에서 오류가 발생했습니다." });
    }
};

module.exports = signup;