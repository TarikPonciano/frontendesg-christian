// esg-frontend/src/components/AnaliseSA.js

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getRelatorioAcoes, getEnvironmentalData, getSocialData, getGovernanceData } from '../services/Api';

const AnaliseSA = () => {
  const [roadMapData, setRoadMapData] = useState([]);
  const [esgDiagnosis, setEsgDiagnosis] = useState(0);

  const [environmentData, setEnvironmentData] = useState([]);
  const [socialData, setSocialData] = useState([]);
  const [governanceData, setGovernanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const envData = await getEnvironmentalData() || [];
      const socData = await getSocialData() || [];
      const govData = await getGovernanceData() || [];
      const actionsData = await getRelatorioAcoes() || [];

      setEnvironmentData(formatChartData(envData));
      setSocialData(formatChartData(socData));
      setGovernanceData(formatChartData(govData));
      setRoadMapData(actionsData);

      const combinedData = [...envData, ...socData, ...govData];
      if (combinedData.length > 0) {
        setEsgDiagnosis(calculateEsgDiagnosis(combinedData));
      }
    };

    fetchData();
  }, []);

  const formatChartData = (data) => 
    data.map(item => ({
      categoria: item.categoria,
      porcentagem_sim: item.porcentagem_sim
    }));

  const calculateEsgDiagnosis = (data) => {
    const totalScore = data.reduce((acc, curr) => acc + curr.porcentagem_sim, 0);
    return (totalScore / data.length).toFixed(2);
  };

  const roadMapColumns = ['Categoria', 'Planos de Ação', 'Não Iniciado', 'Em Andamento', 'Atrasado', 'Concluído', 'Gasto Planejado', 'Gasto Realizado'];

  const statusData = [
    { name: 'Meio Ambiente', NaoIniciado: 1, EmAndamento: 0, Atrasado: 0, Concluído: 1 },
    { name: 'Social', NaoIniciado: 1, EmAndamento: 1, Atrasado: 0, Concluído: 0 },
    { name: 'Governança', NaoIniciado: 0, EmAndamento: 1, Atrasado: 1, Concluído: 1 },
  ];

  const expenseData = [
    { name: 'Meio Ambiente', Planejado: 2000, Realizado: 1500 },
    { name: 'Social', Planejado: 4000, Realizado: 3500 },
    { name: 'Governança', Planejado: 2000, Realizado: 1800 }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>Análise Sustentabilidade Agora</Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Diagnóstico ESG:</Typography>
        <Typography variant="body1">{esgDiagnosis}%</Typography>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Meio Ambiente</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={environmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="porcentagem_sim" fill="rgba(75, 192, 192, 0.6)" name="Meio Ambiente" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Social</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={socialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="porcentagem_sim" fill="rgba(54, 162, 235, 0.6)" name="Social" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Governança</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={governanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="porcentagem_sim" fill="rgba(255, 99, 132, 0.6)" name="Governança" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Status dos Planos de Ação por Segmento:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="NaoIniciado" fill="rgba(99, 255, 132, 0.6)" name="Não Iniciado" />
            <Bar dataKey="EmAndamento" fill="rgba(54, 162, 235, 0.6)" name="Em Andamento" />
            <Bar dataKey="Atrasado" fill="rgba(255, 99, 132, 0.6)" name="Atrasado" />
            <Bar dataKey="Concluído" fill="rgba(75, 192, 192, 0.6)" name="Concluído" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Gastos: Planejado x Realizado</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Planejado" fill="rgba(99, 255, 132, 0.6)" name="Planejado" />
            <Bar dataKey="Realizado" fill="rgba(132, 99, 255, 0.6)" name="Realizado" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Road Map:</Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {roadMapColumns.map((column) => (
                  <TableCell key={column} align="center">{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roadMapData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.category}</TableCell>
                  <TableCell align="center">{row.planned}</TableCell>
                  <TableCell align="center">{row.notStarted}</TableCell>
                  <TableCell align="center">{row.inProgress}</TableCell>
                  <TableCell align="center">{row.delayed}</TableCell>
                  <TableCell align="center">{row.completed}</TableCell>
                  <TableCell align="center">R$ {row.plannedCost ? row.plannedCost.toLocaleString('pt-BR') : '0'}</TableCell>
                  <TableCell align="center">R$ {row.actualCost ? row.actualCost.toLocaleString('pt-BR') : '0'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AnaliseSA;
