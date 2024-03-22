const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const Token = require('../model/Token');

dotenv.config();

const createNewToken = async (req, res) => {
    const refreshToken = req.body.refreshToken.split(' ')[1];
    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token is missing' })
    }

    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
        return res.status(404).json({ msg: 'Refresh token is not valid' });
    }

    jwt.verify(token.token, process.env.REFRESH_SECRET_KEY, (error, user) => {
        if (error) {
            res.status(500).json({ msg: 'invalid refresh token' });
        }
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET_KEY, { expiresIn: "5m" });

        return res.status(200).json({ accessToken: accessToken })
    })
}

module.exports = { createNewToken }