const express = require('express');
const router = express.Router();

const { createTask, getTask, updateTask, deleteTask } = require("../controller/task-controller");
const { createUsers } = require("../controller/user-controller");
const { userLogin } = require("../controller/userlogin-controller");
const { createNewToken } = require("../controller/jwt-controller");
const { getCategory, getSelectCategory, createCategory, updateCategory, deleteCategory } = require("../controller/category-controller")

// TASK API
router.get('/todolist/:userId', getTask);
router.post("/todolist/createTask", createTask)
router.put("/todolist/updateTask/:id", updateTask)
router.delete("/todolist/deleteTask/:id", deleteTask)

// CATEGORY API
router.get("/todolist/categories/:userId", getCategory);
router.get("/todolist/category/:_id", getSelectCategory);
router.post("/todolist/categories/create", createCategory);
router.put("/todolist/categories/update/:_id", updateCategory);
router.delete("/todolist/categories/delete/:_id", deleteCategory);

// SignUp API
router.post("/user/create", createUsers);

// LOGIN API
router.post("/login", userLogin)

//New Token Generate Api 
router.post('/token', createNewToken);

module.exports = router;