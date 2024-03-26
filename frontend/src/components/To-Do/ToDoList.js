import React, { useState, useEffect, useRef } from "react";
import {
  List,
  Checkbox,
  Input,
  Button,
  Typography,
  message,
  Tooltip,
  Select,
  Divider,
  Space,
  Row,
  Col,
} from "antd";
import axios from "axios";
import "./ToDoList.css";
import {
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import authService from "../../services/auth-service";
import moment from "moment";
import { Pagination } from "antd";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const userId = authService.getCurrentUser();
  const inputRef = useRef(null);
  let index = 0;

  const getTask = async () => {
    const response = await axios.get(
      `http://localhost:8000/todolist/${userId.id}`
    );
    if (response) {
      const sortedTasks = response.data.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        // Sort by date in descending order
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
        // If dates are the same, sort by time in descending order
        return (
          new Date(`1970/01/01 ${b.updatedAt.split(" ")[1]}`) -
          new Date(`1970/01/01 ${a.updatedAt.split(" ")[1]}`)
        );
      });
      setTasks(sortedTasks);
    } else {
      setTasks([]);
    }
  };
  useEffect(() => {
    getTask();
  }, []);

  const getCategory = async () => {
    const response = await axios.get(
      `http://localhost:8000/todolist/categories/${userId.id}`
    );
    response ? setCategories(response.data) : setCategories([]);
  };
  useEffect(() => {
    getCategory();
  }, []);

  const handleNewTaskSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/todolist/createTask", {
        task: newTask,
        categoryId: selectedCategory,
        userId: userId.id,
      });
      message.success("New Task Added Successfully");
      setNewTask("");
      setSelectedCategory([]);
      getTask();
    } catch (err) {
      message.error("Input Field is required");
    }
  };

  const handleUpdate = async (task_id) => {
    try {
      await axios.put(`http://localhost:8000/todolist/updateTask/${task_id}`, {
        task: editedTask,
        categoryIds: isEditing.categoryIds,
      });
      getTask();
      message.success("Task Updated Successfully");
      setEditedTask("");
      setIsEditing(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckToggle = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      await axios.put(
        `http://localhost:8000/todolist/updateTask/${task._id}`,
        updatedTask
      );
      updatedTask.completed
        ? message.success("Task marked as completed")
        : message.success("Task marked as incomplete");
      getTask();
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskDelete = async (task_id) => {
    try {
      await axios.delete(
        `http://localhost:8000/todolist/deleteTask/${task_id}`
      );
      message.success("Task Deleted Successfully");
      getTask();
    } catch (err) {
      console.log(err);
    }
  };

  const addCategory = async () => {
    try {
      await axios.post("http://localhost:8000/todolist/categories/create", {
        name: newCategory,
        userId: userId.id,
      });
      setCategories([
        ...categories,
        { name: `<strong>${newCategory}</strong>` } ||
          `<strong>New item ${index++}</strong>`,
      ]);
      setNewCategory("");
      getCategory();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (err) {
      setNewCategory("");
      if (err.response.status === 403) {
        message.error(err.response.data.message);
      } else {
        message.error(err.response.data.message);
      }
    }
  };

  const filterTasks = (tasks, searchQuery) => {
  if (!searchQuery) {
    return tasks;
  }

  const filteredTasks = tasks.filter((task) => {
    const taskText = task.task.toLowerCase();
    const categoryNames = task.categoryId.map((category) =>
      category.name.toLowerCase()
    );
    const query = searchQuery.toLowerCase();

    return (
      taskText.includes(query) ||
      categoryNames.some((name) => name.includes(query)) ||
      query === ""
    );
  });

  return filteredTasks;
};

  return (
    <>
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col>
          <Typography.Title level={1} style={{ textAlign: "center" }}>
            Task List
          </Typography.Title>
        </Col>
      </Row>
      <Row justify="end" style={{ marginBottom: "30px" }}>
        <Col span={12} style={{ paddingRight: "10px" }}>
          <Input
            placeholder="Filter by task or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "600px", fontSize: "16px" }}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
      </Row>
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col span={12} style={{ paddingRight: "10px", paddingLeft: "20px" }}>
          <Input
            placeholder="Enter a new task"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            style={{ width: "100%" }}
            allowClear
          />
        </Col>
        <Col span={10} style={{ paddingRight: "10px" }}>
          <Select
            mode="multiple"
            placeholder="Select category"
            value={selectedCategory || []}
            onChange={(value) => {
              setSelectedCategory(value && value.length > 0 ? value : null);
            }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    placeholder="Create new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={addCategory}
                  >
                    Add Category
                  </Button>
                </Space>
              </>
            )}
            options={categories.map((category) => ({
              label: <strong>{category.name}</strong>,
              value: category._id,
            }))}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={2} style={{ paddingLeft: "10px" }}>
          <Button type="primary" onClick={handleNewTaskSubmit}>
            Add Task
          </Button>
        </Col>
      </Row>
      <List
        dataSource={filterTasks(tasks, searchQuery).slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        renderItem={(task) => {
          const isEditingTask = isEditing && isEditing.taskId === task._id;
          return (
            <List.Item
              style={{
                width: "100%",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => handleCheckToggle(task)}
                style={{ padding: "10px" }}
              />
              {isEditingTask ? (
                <>
                  <Input
                    defaultValue={task.task}
                    onChange={(event) => setEditedTask(event.target.value)}
                    onPressEnter={() => handleUpdate(task._id)}
                    style={{ marginRight: "10px", width: "600px" }}
                  />
                  <Select
                    mode="multiple"
                    value={isEditing.categoryIds}
                    onChange={(value) =>
                      setIsEditing({ ...isEditing, categoryIds: value })
                    }
                    style={{ marginRight: "10px", width: "300px" }}
                    options={categories.map((category) => ({
                      label: <strong>{category.name}</strong>,
                      value: category._id,
                    }))}
                  />
                </>
              ) : (
                <span
                  style={
                    task.completed
                      ? {
                          textDecoration: "line-through 1.5px",
                          color: "grey",
                          width: "1000px",
                        }
                      : { width: "1000px" }
                  }
                  onDoubleClick={() => {
                    setIsEditing({
                      taskId: task._id,
                      categoryIds: task.categoryId.map((cat) => cat._id),
                    });
                    setEditedTask(task.task);
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Typography.Text style={{ fontSize: "medium" }}>
                        {task.task}
                      </Typography.Text>
                      <Typography.Paragraph style={{ fontSize: "small" }}>
                        Category:{" "}
                        <strong>
                          {task?.categoryId
                            ?.map((category) => category?.name)
                            ?.toString()}
                        </strong>
                      </Typography.Paragraph>
                    </div>
                    <div style={{ color: "darkgray", fontSize: "small" }}>
                      <div>
                        Created{" "}
                        {moment(task.createdAt).format(
                          "MMM D, YYYY [at] hh:mm:ss"
                        )}
                      </div>
                      {task.updatedAt !== task.createdAt && (
                        <div>
                          Updated{" "}
                          {moment(task.updatedAt).format(
                            "MMM D, YYYY [at] hh:mm:ss"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </span>
              )}
              {isEditingTask ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => handleUpdate(task._id)}
                    style={{ marginRight: 5 }}
                  >
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Tooltip placement="top" title="Edit Task ">
                    <EditTwoTone
                      onClick={() => {
                        setIsEditing({
                          taskId: task._id,
                          categoryIds: task.categoryId.map((cat) => cat._id),
                        });
                        setEditedTask(task.task);
                      }}
                      style={{ padding: "10px" }}
                    />
                  </Tooltip>
                  <Tooltip placement="top" title="Delete Task ">
                    <DeleteTwoTone onClick={() => handleTaskDelete(task._id)} />
                  </Tooltip>
                </>
              )}
            </List.Item>
          );
        }}
      />
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filterTasks(tasks, searchQuery).length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger
          onShowSizeChange={(current, size) => setPageSize(size)}
          showQuickJumper
          showTotal={(total) => `Total ${total} tasks`}
        />
      </Row>
    </>
  );
};

export default TodoList;
