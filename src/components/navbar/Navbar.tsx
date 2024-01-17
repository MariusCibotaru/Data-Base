import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Box, Typography, styled, CSSObject, Theme, Divider } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/User';
import { AppDispatch } from '../../redux/store';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';

const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const drawerWidth = 300;

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = () => {
    navigate('/auth/Autentificare');
  };

  const handleMyAccount = () => {
    navigate('/myaccount');
  };
  
  const handleCreatePost = () => {
    navigate('/create');
  };

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <Box>
      <Drawer variant="permanent" open={open}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box display="flex" alignItems="center" justifyContent="center" p={1}>
            {open ? (
              <>
                <Link to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="h4" style={{ fontWeight: 'bold' }}>LOGO</Typography>
                </Link>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </>
            ) : (
              <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                <IconButton onClick={handleDrawerOpen}>
                  <MenuIcon />
                </IconButton>
                <IconButton onClick={navigateHome}>
                  <HomeIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          <Divider />
          {isAuthenticated && (
            <Box display="flex" flexDirection="column" alignItems={open ? "flex-start" : "center"} p={1}>
              <Box display="flex" alignItems="center" justifyContent={open ? "flex-start" : "center"}>
                <IconButton onClick={handleMyAccount}>
                  <AccountCircleIcon fontSize={open ? "large" : "medium"} />
                </IconButton>
                {open && (
                <Box display="flex" alignItems="center" style={{ cursor: 'pointer' }} onClick={handleMyAccount}>
                  <Typography variant="h6">{currentUser?.username}</Typography>
                </Box>
                )}
              </Box>
              <Box display="flex" alignItems="center" >
                <IconButton onClick={handleCreatePost} style={{ fontSize: '1.1rem' }}>
                  <EditIcon fontSize={open ? "large" : "medium"} />
                </IconButton>
                {open && (
                <Box display="flex" alignItems="center" style={{ cursor: 'pointer' }} onClick={handleCreatePost}>
                  <Typography variant="h6">Creaza Post</Typography>
                </Box>
                )}
              </Box>             
            </Box>
          )}
          <Divider />
          <Box flexGrow={1}>
          </Box>

          {isAuthenticated && (
            <>
              <Box display="flex" flexDirection="column" alignItems={open ? "flex-start" : "center"} px={1}>
                <Box display="flex" alignItems="center" justifyContent={open ? "flex-start" : "center"}>
                  <IconButton>
                    <SettingsIcon fontSize={open ? "large" : "medium"} />
                  </IconButton>
                  {open && (
                    <Box display="flex" alignItems="center" style={{ cursor: 'pointer' }} onClick={handleMyAccount}>
                      <Typography variant="h6">Setari</Typography>
                    </Box>
                  )}
                  <Divider />
                </Box>
              </Box>
              <Divider sx={{width: '100%'}}/>
            </>
          )}
          <Box display="flex" flexDirection="column" alignItems={open ? "flex-start" : "center"} px={1}>
            <Box display="flex" alignItems="center" justifyContent={open ? "flex-start" : "center"}>
                <Box onClick={isAuthenticated ? handleLogout : handleLogin} style={{ display: 'flex', alignItems: 'center', justifyContent: open ? "flex-start" : "center", cursor: 'pointer' }}>
                  <IconButton>
                    {isAuthenticated ? 
                    <LogoutIcon fontSize={open ? "large" : "medium"} /> 
                    :
                    <LoginIcon fontSize={open ? "large" : "medium"} />}
                  </IconButton>
                  {open && (
                    <Typography variant="h6">{isAuthenticated ? "Iesire" : "Autentificare"}</Typography>
                    )}
                </Box>
            </Box>
          </Box>
          
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
