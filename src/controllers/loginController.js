const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    const { userId, userPassword } = req.body;
    try {
        const user = await User.findOne({ userId });
        const isMatch = bcrypt.compare(userPassword, user?.userPassword);
        if (!user || !isMatch) {
            return res
                .status(400)
                .json({ message: "아이디 또는 비밀번호를 확인해주세요" });
        }

        res
            .status(200)
            .json({
                message: "로그인 성공",
                user: { id: user._id, userId: user.userId },
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login };
