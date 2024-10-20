// esg-frontend/src/components/RelatorioGeral.js

import React, { useEffect, useState } from 'react';
import { getRelatorioGeral } from '../services/Api';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Box } from '@mui/material';

const RelatorioGeral = () => {
  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    async function fetchRelatorioGeral() {
      try {
        const res = await getRelatorioGeral();
        setRelatorios(res);
      } catch (error) {
        console.error('Erro ao obter relatório geral', error);
      }
    }
    fetchRelatorioGeral();
  }, []);

  const formatValue = (value, type) => {
    if (type === 'Percentual') {
      return `${parseFloat(value).toFixed(2)}%`;
    } else if (type === 'Número') {
      return `${parseFloat(value).toFixed(1)}`;
    } else if (type === 'Moeda') {
      return `R$${parseFloat(value).toFixed(2)}`;
    } else {
      return value; // Retorna o valor sem formatação se o tipo não for reconhecido
    }
  };

  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(0)}%`;  // Converte o valor para um número fixo e acrescenta o símbolo de porcentagem
  };

  return (
    <Box sx={{ padding: 3, mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-right' }}>
    <Paper elevation={4} style={{ margin: '20px', overflowX: 'auto' }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Indicador</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Eixo</TableCell>
            <TableCell>Tema</TableCell>
            <TableCell>Meta Total</TableCell>
            <TableCell>Realizado Total</TableCell>
            <TableCell>%</TableCell>
            <TableCell>Ações Previstas</TableCell>
            <TableCell>Ações Concluídas</TableCell>
            <TableCell>%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relatorios.map((item, index) => (
            <TableRow 
              key={index} 
              sx={{
                // Aplica a cor de fundo baseada no valor de item.eixo
                backgroundColor: item.eixo === 'Ambiental' ? 'lightgreen' :
                                item.eixo === 'Social' ? 'lightblue' :
                                item.eixo === 'Governança' ? 'lightcoral' : 'none',
              }}
              >
              <TableCell>{item.indicador}</TableCell>
              <TableCell>{item.tipo}</TableCell>
              <TableCell>{item.eixo}</TableCell>
              <TableCell>{item.tema}</TableCell>
              <TableCell>{formatValue(item.metatotal, item.tipo)}</TableCell>
              <TableCell>{formatValue(item.realizadototal, item.tipo)}</TableCell>
              <TableCell>{formatPercentage(item.percentual_realizado)}</TableCell>
              <TableCell>{item.acoes_previstas}</TableCell>
              <TableCell>{item.acoes_concluidas}</TableCell>
              <TableCell>{formatPercentage(item.percentual_acoes)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>
  );
};

export default RelatorioGeral;
