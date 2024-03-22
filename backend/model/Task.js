const mongoose = require("mongoose");
const User = require('../model/Users')
const Category = require('../model/Category')

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
},
    { timestamps: true }
)

module.exports = mongoose.model("Task", taskSchema);
