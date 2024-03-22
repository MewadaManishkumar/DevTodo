const mongoose = require("mongoose");
const User = require('../model/Users')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Category", categorySchema);

