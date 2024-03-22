import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link } from "react-router-dom";
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import ToDoList from './components/To-Do/ToDoList';
import { useEffect } from 'react';

import AuthService from './services/auth-service';
import { Header } from 'antd/es/layout/layout';
import { Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import CategoryList from './components/Category/CategoryList';
import CategoryForm from './components/Category/CategoryForm';

function App() {
  const token = localStorage.getItem('accessToken')

  useEffect(() => {
    if (token) {
      const refreshToken = async () => {
        try {
          const response = await AuthService.refreshToken();
          localStorage.setItem('accessToken', response.accessToken);

          const existingData = JSON.parse(localStorage.getItem('user'));
          existingData.accessToken = response.accessToken;
          localStorage.setItem('user', JSON.stringify(existingData));
        } catch (error) {
          console.error(error);
        }
      }
      const intervalId = setInterval(refreshToken, 300000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [token]);

  const items = [
    {
      key: 1,
      label: <Link to='/todolist/categories' style={{ fontSize: '15px', textDecoration: 'none' }}>Category</Link>
    },
    {
      key: 2,
      icon: <LogoutOutlined />,
      label: <Link to="/" style={{ fontSize: '15px', textDecoration: 'none' }}>Logout</Link>,
      onClick: AuthService.logout
    }]

  const Auth = () => {
    const token = localStorage.getItem('accessToken')
    return token ? (
      <div style={{ height: '100vh' }}>
        <Header>
          <Link to='/todolist' className="logo">MY TODO</Link>
          <Menu theme="dark" mode="horizontal" items={items} />
        </Header>
        <Outlet />
      </div>
    ) : (
      <Navigate to="/" replace />
    );
  }


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route element={<Auth />}>
            <Route path="/todolist" element={<ToDoList />} />
          </Route>
          <Route element={<Auth />}>
            <Route path="/todolist/categories" element={<CategoryList />} />
          </Route>
          <Route element={<Auth />}>
            <Route path="/todolist/category/:_id" element={<CategoryForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
