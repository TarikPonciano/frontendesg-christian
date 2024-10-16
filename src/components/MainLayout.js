// esg-frontend/src/components/MainLayout.js

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import SideMenu from './SideMenu';
import ProfileButton from './ProfileButton';

const MainLayout = () => {
  const [isMenuOpen, setMenuOpen] = useState(true); // Por padrão, o menu está aberto
  const [user, setUser] = useState({ name: '', role: '', company: '' });

  useEffect(() => {
    // Substitua isso pela sua lógica para obter os dados do usuário logado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <ProfileButton user={user} />
      <SideMenu isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s, width 0.3s',
          marginLeft: isMenuOpen ? '240px' : '0px', // Ajusta o margin com base no estado do menu
          width: isMenuOpen ? 'calc(100% - 240px)' : '100%', // Ajusta a largura com base no estado do menu
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
