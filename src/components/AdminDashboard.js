// esg-frontend/src/components/AdminDashboard.js

import React, { useState } from 'react';
import {
  Container, Typography, Box, Tabs, Tab
} from '@mui/material';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import DashGeral from './DashGeral';
import DashMensal from './DashMensal';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
);

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderContent = () => {
    switch (tabValue) {
      case 0:
        return <DashGeral />;
      case 1:
        return <DashMensal />;
      default:
        return <Typography variant="subtitle1">Selecione uma aba para ver mais detalhes.</Typography>;
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        flexGrow: 1,
        p: 0,
        width: '100%',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        paddingTop: '100px', // Adiciona espaço vertical
        paddingLeft: '150px',
        paddingRight: '150px', // Adiciona espaço horizontal
      }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Geral" />
          <Tab label="Mensal" />
        </Tabs>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
