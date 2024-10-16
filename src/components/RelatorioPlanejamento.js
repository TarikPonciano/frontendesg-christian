// esg-frontend/src/components/RelatorioPlanejamento.js

import React, { useEffect, useState, useCallback } from 'react';
import { getRelatorioPlanejamento } from '../services/Api';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const RelatorioPlanejamento = () => {
  const [relatorios, setRelatorios] = useState({});
  const [totalGeral, setTotalGeral] = useState({ quantidades: Array(12).fill(0), total: 0 });
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const statusStyles = {
    "Não Iniciado": { background: "#ffffff", order: 1 },
    "Em Andamento": { background: "#ffff00", order: 2 },
    "Concluído": { background: "#00ff00", order: 3 },
    "Atrasado": { background: "#ff0000", order: 4 },
    "Total": { background: "#f0f0f0", order: 5 }
  };

  const processarDados = useCallback((dados) => {
    let novosTotais = { quantidades: Array(12).fill(0), total: 0 };
    const dadosEstruturados = dados.reduce((acc, item) => {
      const { status, mes, quantidade } = item;
      if (!acc[status]) {
        acc[status] = { quantidades: Array(12).fill(0), total: 0 };
      }
      const mesIndex = parseInt(mes) - 1;
      const qtd = parseInt(quantidade);
      acc[status].quantidades[mesIndex] = qtd;
      acc[status].total += qtd;
      
      novosTotais.quantidades[mesIndex] += qtd;
      novosTotais.total += qtd;

      return acc;
    }, {});

    setRelatorios(dadosEstruturados);
    setTotalGeral(novosTotais);
  }, []);

  useEffect(() => {
    async function fetchRelatorioPlanejamento() {
      try {
        const res = await getRelatorioPlanejamento();
        processarDados(res);
      } catch (error) {
        console.error('Erro ao obter relatório de planejamento', error);
      }
    }

    fetchRelatorioPlanejamento();
  }, [processarDados]);

  return (
    <Paper elevation={4} style={{ margin: '20px', overflowX: 'auto' }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            {meses.map(mes => <TableCell key={mes}>{mes}</TableCell>)}
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(relatorios)
            .sort((a, b) => (statusStyles[a[0]]?.order || 6) - (statusStyles[b[0]]?.order || 6))
            .map(([status, { quantidades, total }]) => (
              <TableRow key={status} style={{ backgroundColor: statusStyles[status]?.background || "#fff" }}>
                <TableCell>{status}</TableCell>
                {quantidades.map((quantidade, index) => (
                  <TableCell key={index}>{quantidade}</TableCell>
                ))}
                <TableCell>{total}</TableCell>
              </TableRow>
          ))}
          <TableRow style={{ backgroundColor: statusStyles["Total"].background }}>
            <TableCell>Total</TableCell>
            {totalGeral.quantidades.map((total, index) => (
              <TableCell key={index}>{total}</TableCell>
            ))}
            <TableCell>{totalGeral.total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RelatorioPlanejamento;
