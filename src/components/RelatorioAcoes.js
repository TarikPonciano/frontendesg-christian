// esg-frontend/src/components/RelatorioAcoes.js

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getRelatorioAcoes } from '../services/Api';

const RelatorioAcoes = () => {
  const [relatorioData, setRelatorioData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRelatorioAcoes();
        // Conversão e tratamento de dados numéricos diretamente no fetch
        const formattedData = data.map(item => ({
          ...item,
          gastoPlanejado: parseFloat(item.gastoPlanejado) || 0,
          gastoRealizado: parseFloat(item.gastoRealizado) || 0,
          diferenca: parseFloat(item.gastoPlanejado) - parseFloat(item.gastoRealizado)
        }));
        setRelatorioData(formattedData);
      } catch (error) {
        console.error('Erro ao buscar dados do relatório:', error);
      }
    };

    fetchData();
  }, []);

  // Função auxiliar para formatar números como moeda
  const formatCurrency = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return 'R$ 0,00';
    }
    const formatOptions = { style: 'currency', currency: 'BRL' };
    return new Intl.NumberFormat('pt-BR', formatOptions).format(num);
  };

  const categories = [
    { name: "Meio Ambiente", color: "lightgreen", subcategories: ["Resíduos", "Energia", "Água", "Natureza", "Pegada de Carbono"] },
    { name: "Social", color: "lightblue", subcategories: ["Trabalho", "Clientes", "Equipe", "Comunidade", "Segurança e Qualidade"] },
    { name: "Governança", color: "salmon", subcategories: ["Finanças", "Ética", "Diretoria", "Conduta", "Relação com o Governo"] }
  ];

  const calculateTotals = (subcategories) => {
    return subcategories.reduce((acc, sub) => {
      const data = relatorioData.find(item => item.categoria === sub) || {
        planosDeAcao: 0,
        naoIniciado: 0,
        emAndamento: 0,
        atrasado: 0,
        concluido: 0,
        gastoPlanejado: 0,
        gastoRealizado: 0,
        diferenca: 0
      };
      Object.keys(acc).forEach(key => {
        acc[key] += data[key] || 0;
      });
      acc.diferenca = acc.gastoPlanejado - acc.gastoRealizado;
      return acc;
    }, {
      planosDeAcao: 0,
      naoIniciado: 0,
      emAndamento: 0,
      atrasado: 0,
      concluido: 0,
      gastoPlanejado: 0,
      gastoRealizado: 0,
      diferenca: 0
    });
  };

  const grandTotal = calculateTotals(categories.flatMap(cat => cat.subcategories));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Categorias</TableCell>
            <TableCell align="center">Planos de Ação</TableCell>
            <TableCell align="center">Não Iniciado</TableCell>
            <TableCell align="center">Em Andamento</TableCell>
            <TableCell align="center">Atrasado</TableCell>
            <TableCell align="center">Concluído</TableCell>
            <TableCell align="center">Gasto Planejado</TableCell>
            <TableCell align="center">Gasto Realizado</TableCell>
            <TableCell align="center">Diferença</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => {
            const categoryTotals = calculateTotals(category.subcategories);
            return [
              <TableRow key={category.name}>
                <TableCell component="th" scope="row" style={{ backgroundColor: category.color, fontWeight: 700 }}>
                  {category.name}
                </TableCell>
                <TableCell align="center">{categoryTotals.planosDeAcao}</TableCell>
                <TableCell align="center">{categoryTotals.naoIniciado}</TableCell>
                <TableCell align="center">{categoryTotals.emAndamento}</TableCell>
                <TableCell align="center">{categoryTotals.atrasado}</TableCell>
                <TableCell align="center">{categoryTotals.concluido}</TableCell>
                <TableCell align="center">{formatCurrency(categoryTotals.gastoPlanejado)}</TableCell>
                <TableCell align="center">{formatCurrency(categoryTotals.gastoRealizado)}</TableCell>
                <TableCell align="center">{formatCurrency(categoryTotals.diferenca)}</TableCell>
              </TableRow>,
              ...category.subcategories.map((sub) => {
                const data = relatorioData.find(item => item.categoria === sub) || {};
                return (
                  <TableRow key={sub}>
                    <TableCell style={{ paddingLeft: "20px" }}>{sub}</TableCell>
                    <TableCell align="center">{data.planosDeAcao || 0}</TableCell>
                    <TableCell align="center">{data.naoIniciado || 0}</TableCell>
                    <TableCell align="center">{data.emAndamento || 0}</TableCell>
                    <TableCell align="center">{data.atrasado || 0}</TableCell>
                    <TableCell align="center">{data.concluido || 0}</TableCell>
                    <TableCell align="center">{formatCurrency(data.gastoPlanejado)}</TableCell>
                    <TableCell align="center">{formatCurrency(data.gastoRealizado)}</TableCell>
                    <TableCell align="center">{formatCurrency(data.diferenca)}</TableCell>
                  </TableRow>
                );
              })
            ];
          })}
          <TableRow key="Grand Total">
            <TableCell component="th" scope="row" style={{ fontWeight: 700 }}>Total Geral</TableCell>
            <TableCell align="center">{grandTotal.planosDeAcao}</TableCell>
            <TableCell align="center">{grandTotal.naoIniciado}</TableCell>
            <TableCell align="center">{grandTotal.emAndamento}</TableCell>
            <TableCell align="center">{grandTotal.atrasado}</TableCell>
            <TableCell align="center">{grandTotal.concluido}</TableCell>
            <TableCell align="center">{formatCurrency(grandTotal.gastoPlanejado)}</TableCell>
            <TableCell align="center">{formatCurrency(grandTotal.gastoRealizado)}</TableCell>
            <TableCell align="center">{formatCurrency(grandTotal.diferenca)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RelatorioAcoes;
