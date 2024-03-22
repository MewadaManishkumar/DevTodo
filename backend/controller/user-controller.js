const User = require("../model/Users")
const bcrypt = require("bcrypt")

const createUsers = async (req, res) => {
    const userData = req.body;
    const fieldsToSave = {
        name: userData.name,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
    }
    if (userData.name !== userData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (userData.name.length < 3 || userData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(userData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (userData.password.length < 6 || userData.password.length > 20) {
        res.status(400).send({ message: 'Password must be 6-20 character long' })
    }
    else if (userData.password !== userData.password.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in password' })
    }
    else {
        const users = new User(fieldsToSave)
        try {
            await users.save();
            res.status(200).send(users);
        } catch (err) {
            res.status(400).send({ message: "This email is already exist!" });
        }
    }
}


module.exports = { createUsers };