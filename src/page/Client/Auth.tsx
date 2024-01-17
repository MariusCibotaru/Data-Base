import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Login from './Login';
import Sign from './Sign';

const Auth = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [selectedTab, setSelectedTab] = useState(tab === 'inregistrare' ? 1 : 0);

  useEffect(() => {
    navigate(`/auth/${selectedTab === 0 ? 'autentificare' : 'inregistrare'}`);
  }, [selectedTab, navigate]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" height="100vh">
      <Tabs value={selectedTab} onChange={handleChange} centered>
        <Tab label={<Typography variant='h5'>Autentificare</Typography>} />
        <Tab label={<Typography variant='h5'>Inregistrare</Typography>} />
      </Tabs>
      <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} width="100%">
        {selectedTab === 0 ? (
          <Sign />
        ) : (
          <Login />
        )}
      </Box>
    </Box>
  );
}

export default Auth;
