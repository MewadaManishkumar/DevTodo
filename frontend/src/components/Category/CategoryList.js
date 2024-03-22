import React, { useState, useEffect } from "react";
import { Button, Space, Table, Typography, Modal, message, Input } from "antd";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import authService from "../../services/auth-service";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { confirm } = Modal;

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const userId = authService.getCurrentUser();

  const getCategories = async () => {
    const response = await axios.get(
      `http://localhost:8000/todolist/categories/${userId.id}`
    );
    response ? setCategories(response.data) : setCategories([]);
  };
  useEffect(() => {
    getCategories();
  }, []);

  const deleteCategory = async (category_id) => {
    try {
      await axios.delete(
        `http://localhost:8000/todolist/categories/delete/${category_id}`
      );
      getCategories();
      message.success("Category deleted successfully");
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.message);
      } else if (error.response.status === 404) {
        message.error(error.response.data.message);
      }
    }
  };

  const handleDelete = (category_id) => {
    confirm({
      title: "Do you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteCategory(category_id);
      },
    });
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search category"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onKeyUp={confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, category) => (
        <Space size="middle">
          <Link to={`/todolist/category/${category._id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(category._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: 20,
        }}
      >
        <Title level={3}>Categories</Title>
      </div>
      <Table columns={columns} dataSource={categories} rowKey="_id" />
    </>
  );
}
export default CategoryList;
