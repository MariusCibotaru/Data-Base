import React from 'react';
import Login from './Login';
import Home from './Home';
import { Box, CircularProgress } from '@mui/material';
import { Routes, Route, Navigate  } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Sign from './Sign';
import CreatePost from './CreatePost';
import MyAccount from './MyAccount';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectStatus } from '../../redux/slices/User';
import Auth from './Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectStatus);
  const token = localStorage.getItem('token'); 

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};


const Main = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Navbar />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="sign" element={<Sign />} />
          <Route path="auth/:tab" element={<Auth />} />
          <Route path="myaccount" element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          } />
          <Route path="create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="create/:postId" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
        </Routes>
        </Box>
    </Box>
  );
}

export default Main;
