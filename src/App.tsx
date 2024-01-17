import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Main from './page/Client/Main';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './redux/store';
import { fetchUserData, selectIsAuthenticated, selectCurrentUser, selectIsLoading } from './redux/slices/User';
import { fetchSubscriptionsByUserId } from './redux/slices/Subscriptions';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem('token'); 
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserData());
    }
    if (isAuthenticated && currentUser?.Id !== undefined) {
      dispatch(fetchSubscriptionsByUserId(currentUser.Id));
    }
  }, [dispatch, isAuthenticated, token]);
  

  if (isLoading && (token || isAuthenticated)) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Main/>
    </Box>
  );
}

export default App;
