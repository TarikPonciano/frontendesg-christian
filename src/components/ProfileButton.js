// esg-frontend/src/components/ProfileButton.js

import React, { useState } from 'react';
import { Avatar, Button, Menu, MenuItem, Box } from '@mui/material';

const ProfileButton = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';  // Redireciona para a página de login
  };

  return (
    <Box sx={{ position: 'fixed', top: 50, right: 50, zIndex: 1300 }}>
      <Button onClick={handleClick} sx={{ p: 0.5 }}>
        <Avatar 
          alt={user?.name}  // Verifica se o user existe antes de acessar a propriedade
          src="/path/to/avatar.jpg"
          sx={{ width: 56, height: 56 }}  // Ajusta o tamanho do Avatar
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>{user?.name} ({user?.role})</MenuItem> {/* Verifica se o user existe */}
        <MenuItem onClick={handleClose}>Empresa: {user?.empresa_name}</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileButton;
