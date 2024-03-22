import React from "react";
import { Form, Input, Button, message, Typography, Image } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const { Title } = Typography;

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const createUser = async (values) => {
    const fieldsToSave = {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
    };
    try {
      await axios.post("http://localhost:8000/user/create", fieldsToSave);
      navigate("/");
      message.success("Account created successfully");
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Signup
        </Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={createUser}
          className="signup-form"
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "",
              },
              {
                validator: (_, value) => {
                  if (value.length < 3) {
                    return Promise.reject(
                      new Error("Name length should be greater than 3")
                    );
                  } else if (value.length > 20) {
                    return Promise.reject(
                      new Error("Name length should be less than 20")
                    );
                  } else if (value !== value.trim()) {
                    return Promise.reject(
                      new Error("Space around is not allowed")
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                message: "The input is not valid E-mail!",
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
              },
              {
                required: true,
                message: "Please enter email",
              },
            ]}
            normalize={(value, prevVal, prevVals) => value.trim()}
          >
            <Input
              onInput={(e) => (e.target.value = e.target.value.toLowerCase())}
              placeholder="john@gmail.com"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              { min: 6 },
              { max: 20 },
            ]}
            normalize={(value, prevVal, prevVals) => value.trim()}
          >
            <Input.Password placeholder="Enter password between 6-20 characters" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
          <Typography.Text
            style={{ display: "block", textAlign: "center", marginTop: "16px" }}
          >
            Already have an account?
            <Link to="/"> Login Now</Link>
          </Typography.Text>
        </Form>
      </div>
      <div style={{ marginLeft: "50px" }}>
        <Image
          src="/login.png"
          alt="Image"
          width={800}
          className="image"
          preview={false}
        />
      </div>
    </div>
  );
};

export default Signup;
