// esg-frontend/src/components/RelatorioESG.js

import React, { useEffect, useState } from 'react';
import { getRelatorioESG } from '../services/Api';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const RelatorioESG = () => {
  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    async function fetchRelatorioESG() {
      try {
        const res = await getRelatorioESG();
        setRelatorios(res);
      } catch (error) {
        console.error('Erro ao obter relatório ESG', error);
      }
    }

    fetchRelatorioESG();
  }, []);

  return (
    <Paper elevation={4} style={{ margin: '20px', overflowX: 'auto' }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Tema</TableCell>
            <TableCell>Eixo</TableCell>
            <TableCell>% Médio de Conclusão</TableCell>
            <TableCell>Ações Previstas</TableCell>
            <TableCell>Ações Concluídas</TableCell>
            <TableCell>%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relatorios.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.tema}</TableCell>
              <TableCell>{item.eixo}</TableCell>
              <TableCell>{`${item.percentual_acoes}%`}</TableCell>
              <TableCell>{item.acoes_previstas}</TableCell>
              <TableCell>{item.acoes_concluidas}</TableCell>
              <TableCell>{`${item.percentual_acoes}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RelatorioESG;

