// esg-frontend/src/components/LoginForm.js

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Link, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth(true);
            navigate('/analiseesg'); // Usuário já autenticado
        }
    }, [setAuth, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { token, name, role, empresa_id, empresa_name } = data;
                if (token && name && role && empresa_id && empresa_name) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify({
                        name,
                        role,
                        empresa_id,
                        empresa_name,
                    }));
                    setAuth(true);
                    navigate('/analiseesg');
                } else {
                    alert('Erro no login: dados incompletos recebidos.');
                }
            } else {
                alert(data.msg || 'Erro no login.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login: ' + error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#ADD8E6' }}>
            <Box
                sx={{
                    flex: 1,
                    backgroundImage: 'url(/background.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundColor: '#ADD8E6',
                }}
            />
            <Box
                component={Paper}
                elevation={6}
                square
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleLogin}
                    sx={{ mt: 1, width: '100%', maxWidth: '400px' }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-mail"
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
                        label="Senha"
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
                        Entrar
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        sx={{ mt: 1, mb: 2 }}
                    >
                        Logar com Google
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Link href="#" variant="body2">
                            Esqueceu a senha?
                        </Link>
                        <Link href="#" variant="body2">
                            {"Não tem uma conta? Inscrever-se"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginForm;
