import React, { FormEvent, useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { loginUser, selectIsAuthenticated } from '../../redux/slices/User';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            navigate('/');
            console.log(isAuthenticated)

        } catch (error) {
            console.error('Ошибка входа', error);
        }
    };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Intrare in cont
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Адрес"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Sign;
