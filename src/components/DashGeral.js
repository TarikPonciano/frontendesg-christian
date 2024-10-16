// esg-frontend/src/components/DashGeral.js

import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableRow, TableContainer, Paper, TableHead } from '@mui/material';
import { getRelatorioGeral, getPorEixo } from '../services/Api';

const initialState = {
  quantidade: 0,
  percentualMetas: '0%',
  acoesPrevistas: 0,
  acoesRealizadas: 0,
  percentualConclusao: '0%',
};

const DashGeral = () => {
  const [data, setData] = useState({
    analisados: { ...initialState },
    ambientais: { ...initialState },
    sociais: { ...initialState },
    governanca: { ...initialState },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAverage = useCallback((totalPercentualMetas, count) => {
    return count > 0 ? (totalPercentualMetas / count).toFixed(1) : '0';
  }, []);

  const calculatePercentualConclusao = useCallback((acoesRealizadas, acoesPrevistas) => {
    if (acoesPrevistas === 0) return '0%';
    return `${((acoesRealizadas / acoesPrevistas) * 100).toFixed(1)}%`;
  }, []);

  const processData = useCallback((generalData, eixoCounts) => {
    const newData = {
      analisados: { ...initialState, totalPercentualMetas: 0, count: 0 },
      ambientais: { ...initialState, totalPercentualMetas: 0, count: 0 },
      sociais: { ...initialState, totalPercentualMetas: 0, count: 0 },
      governanca: { ...initialState, totalPercentualMetas: 0, count: 0 },
    };

    generalData.forEach(item => {
      const eixoKey = {
        'Ambiental': 'ambientais',
        'Social': 'sociais',
        'Governanca': 'governanca',
        'Governança': 'governanca',
      }[item.eixo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')];

      if (newData[eixoKey]) {
        newData[eixoKey].quantidade = parseInt(eixoCounts[item.eixo], 10) || 0;
        newData[eixoKey].acoesPrevistas += parseInt(item.acoes_previstas, 10) || 0;
        newData[eixoKey].acoesRealizadas += parseInt(item.acoes_concluidas, 10) || 0;
        const percentual = parseFloat(item.percentual_realizado) || 0;
        newData[eixoKey].totalPercentualMetas += percentual;
        newData[eixoKey].count++;
      }
    });

    // Atualiza os dados de 'analisados'
    newData.analisados.quantidade =
      newData.ambientais.quantidade +
      newData.sociais.quantidade +
      newData.governanca.quantidade;
    newData.analisados.acoesPrevistas =
      newData.ambientais.acoesPrevistas +
      newData.sociais.acoesPrevistas +
      newData.governanca.acoesPrevistas;
    newData.analisados.acoesRealizadas =
      newData.ambientais.acoesRealizadas +
      newData.sociais.acoesRealizadas +
      newData.governanca.acoesRealizadas;
    newData.analisados.totalPercentualMetas =
      newData.ambientais.totalPercentualMetas +
      newData.sociais.totalPercentualMetas +
      newData.governanca.totalPercentualMetas;
    newData.analisados.count =
      newData.ambientais.count +
      newData.sociais.count +
      newData.governanca.count;

    // Cálculo de percentuais
    Object.keys(newData).forEach(key => {
      newData[key].percentualMetas =
        calculateAverage(newData[key].totalPercentualMetas, newData[key].count) + '%';
      newData[key].percentualConclusao = calculatePercentualConclusao(
        newData[key].acoesRealizadas,
        newData[key].acoesPrevistas
      );
    });

    return newData;
  }, [calculateAverage, calculatePercentualConclusao]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getRelatorioGeral(), getPorEixo()])
      .then(([generalData, eixoData]) => {
        const eixoCounts = {};
        eixoData.forEach(eixo => {
          eixoCounts[eixo.eixo] = eixo.total_eixo;
        });
  
        if (!generalData || generalData.length === 0) {
          setError('No data available');
          setLoading(false);
          return;
        }
  
        const processedData = processData(generalData, eixoCounts);
        setData(processedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar os dados:', error);
        setError(
          error.message.includes('NetworkError')
            ? 'Erro de conexão. Verifique sua rede.'
            : 'Erro ao processar os dados.'
        );
        setLoading(false);
      });
  }, [processData]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { analisados, ambientais, sociais, governanca } = data;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="relatório geral ESG">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center" style={{ backgroundColor: '#A9A9A9' }}>
              Indicadores Analisados
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: '#00FF7F' }}>
              Indicadores Ambientais
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: '#1E90FF' }}>
              Indicadores Sociais
            </TableCell>
            <TableCell align="center" style={{ backgroundColor: '#FF0000' }}>
              Indicadores Governança
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" style={{ backgroundColor: '#f5f5f5' }} scope="row">
              Quantidades
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {analisados.quantidade}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {ambientais.quantidade}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {sociais.quantidade}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {governanca.quantidade}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" style={{ backgroundColor: '#f5f5f5' }} scope="row">
              % Realização das Metas
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {analisados.percentualMetas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {ambientais.percentualMetas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {sociais.percentualMetas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {governanca.percentualMetas}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" style={{ backgroundColor: '#f5f5f5' }} scope="row">
              Ações Previstas
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {analisados.acoesPrevistas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {ambientais.acoesPrevistas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {sociais.acoesPrevistas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {governanca.acoesPrevistas}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" style={{ backgroundColor: '#f5f5f5' }} scope="row">
              Ações Realizadas
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {analisados.acoesRealizadas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {ambientais.acoesRealizadas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {sociais.acoesRealizadas}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {governanca.acoesRealizadas}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" style={{ backgroundColor: '#f5f5f5' }} scope="row">
              % Conclusão de Ações
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {analisados.percentualConclusao}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {ambientais.percentualConclusao}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {sociais.percentualConclusao}
            </TableCell>
            <TableCell align="right" style={{ backgroundColor: '#f5f5f5' }}>
              {governanca.percentualConclusao}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashGeral;
