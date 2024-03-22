const bcrypt = require('bcrypt');
const User = require('../model/Users');
const Token = require('../model/Token');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const userLogin = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'email does not match' });
    }
    else {
        try {
            let match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: "5m" });
                const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET_KEY);

                const newToken = new Token({ token: refreshToken });
                await newToken.save();

                res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, email: user.email, id: user._id });

            } else {
                res.status(400).json({ msg: 'Password does not match' })
            }

        } catch (error) {
            res.status(500).json({ msg: 'error while login the user' })
        }
    }
}

module.exports = { userLogin }