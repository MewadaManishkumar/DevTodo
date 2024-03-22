const Task = require("../model/Task")

const getTask = async (req, res) => {
    try {
        const task = await Task.find({ userId: req.params.userId }).populate('categoryId')
        res.send(task)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

const createTask = async (req, res) => {
    const taskData = req.body
    const fieldToSave = {
        completed: taskData.completed,
        userId: taskData.userId
    }
    if (!taskData.task || taskData.task.trim().length === 0) {
        res.status(403).send({ message: 'Input field is required!' });
        return false;
    }
    else {
        fieldToSave.task = taskData.task
    }
    if (taskData?.categoryId) {
        fieldToSave.categoryId = taskData?.categoryId
    }

    const task = new Task(fieldToSave)
    try {
        await task.save();
        res.send(task)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

const updateTask = async (req, res) => {
    const updateTaskData = req.body;
    const fieldToSave = {
      task: updateTaskData.task,
      completed: updateTaskData.completed,
      userId: updateTaskData.userId,
      categoryId: updateTaskData.categoryIds,
    };
  
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: fieldToSave },
        { new: true }
      );
  
      if (!task) {
        res.status(400).send({ message: "Task not found" });
      }
  
      res.send(task);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  };

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(400).send({ message: "Task not found" })
        }
        res.send({ message: "Task Deleted" })
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
}

module.exports = { createTask, getTask, updateTask, deleteTask }