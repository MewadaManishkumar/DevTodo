import React from 'react';
import { Form, Input, Button, Typography, message, Image } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
// import illustrationImage from './assets/login.png'; 

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/login', values);
      if (response.status === 200) {
        localStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
        localStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/todolist');
        message.success('You are logged in successfully');
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.msg);
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Login to Store</Title>
        <Form
          name="login"
          form={form}
          onFinish={onLogin}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              LOGIN
            </Button>
            {/* <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link href="#">Forget Password?</Link>
            </div> */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              Don't have an account? <Link to="/signup">Signup Now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginLeft: '50px' }}>
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

export default Login;