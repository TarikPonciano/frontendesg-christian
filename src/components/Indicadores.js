// esg-frontend/src/components/Indicadores.js

import React, { useState, useEffect } from 'react';
import {
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getIndicators, saveIndicators, updateIndicador, deleteIndicador, getABNTInfo } from '../services/Api'; // Funções para API

const Indicadores = () => {
  const [indicadores, setIndicadores] = useState([]);
  const [novoIndicador, setNovoIndicador] = useState({
    nomeIndicador: '',
    tipo: '',
    tema: '',
    eixo: ''
  });
  const [temas, setTemas] = useState([]); // Lista de temas da ABNT PR 2030
  const [eixos, setEixos] = useState([]); // Lista de eixos filtrada pelo tema selecionado
  const [abntData, setAbntData] = useState([]); // Dados completos da tabela ABNT PR 2030
  const [indicadorEditando, setIndicadorEditando] = useState(null); // Estado para edição de indicador
  const usuario = JSON.parse(localStorage.getItem('user')); // Obter informações do usuário logado
  const navigate = useNavigate();

  // Função para buscar os dados de ABNT PR 2030 e indicadores ESG
  useEffect(() => {
    async function fetchInitialData() {
      try {
        // Buscar os temas e eixos da ABNT PR 2030
        const abntInfo = await getABNTInfo();
        setAbntData(abntInfo);
        setTemas([...new Set(abntInfo.map(item => item.temas))]); // Extrair temas únicos
        fetchData(); // Carrega automaticamente os indicadores ao entrar na página
      } catch (error) {
        console.error('Erro ao carregar dados ABNT PR 2030 e indicadores ESG:', error);
      }
    }

    fetchInitialData();
  }, []);

  // Função para buscar os indicadores ESG
  const fetchData = async () => {
    try {
      const data = await getIndicators();
      setIndicadores(data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  // Função para salvar um novo indicador ESG
  const addIndicador = async () => {
    try {
      const indicadorData = { ...novoIndicador, empresa_id: usuario.empresa_id };
      await saveIndicators(indicadorData);
      fetchData();
      alert('Indicador adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar dados: ' + error.message);
    }
  };

  // Função para atualizar um indicador ESG
  const updateIndicadorHandle = async () => {
    try {
      const indicadorData = { ...indicadorEditando, empresa_id: usuario.empresa_id };
      await updateIndicador(indicadorEditando.id, indicadorData);
      fetchData();
      setIndicadorEditando(null);
      alert('Indicador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar indicador:', error);
      alert('Erro ao atualizar indicador: ' + error.message);
    }
  };

  // Função para excluir um indicador ESG
  const deleteIndicadorHandle = async (id) => {
    if (!window.confirm('Você tem certeza que deseja excluir este indicador?')) return;

    try {
      await deleteIndicador(id);
      fetchData();
      alert('Indicador excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir indicador:', error);
      alert('Erro ao excluir indicador: ' + error.message);
    }
  };

  // Função para filtrar os eixos com base no tema selecionado
  const handleTemaChange = (temaSelecionado) => {
    setNovoIndicador({ ...novoIndicador, tema: temaSelecionado });
    const eixosFiltrados = abntData
      .filter(item => item.temas === temaSelecionado)
      .map(item => item.eixo);

    setEixos(eixosFiltrados);
    // Se houver eixos filtrados, selecionar o primeiro como padrão
    if (eixosFiltrados.length > 0) {
      setNovoIndicador(prev => ({ ...prev, eixo: eixosFiltrados[0] }));
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Indicadores</Typography>
      <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
        <TextField
          label="Nome Indicador"
          fullWidth
          value={novoIndicador.nomeIndicador}
          onChange={(e) => setNovoIndicador({ ...novoIndicador, nomeIndicador: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel>Tipo</InputLabel>
          <Select
            value={novoIndicador.tipo}
            label="Tipo"
            onChange={(e) => setNovoIndicador({ ...novoIndicador, tipo: e.target.value })}
          >
            <MenuItem value="Moeda">Moeda</MenuItem>
            <MenuItem value="Percentual">Percentual</MenuItem>
            <MenuItem value="Número">Número</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Tema</InputLabel>
          <Select
            value={novoIndicador.tema}
            label="Tema"
            onChange={(e) => handleTemaChange(e.target.value)} // Filtrar eixos de acordo com o tema selecionado
          >
            {temas.map((tema, index) => (
              <MenuItem key={index} value={tema}>{tema}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Eixo</InputLabel>
          <Select
            value={novoIndicador.eixo}
            label="Eixo"
            onChange={(e) => setNovoIndicador({ ...novoIndicador, eixo: e.target.value })}
          >
            {eixos.map((eixo, index) => (
              <MenuItem key={index} value={eixo}>{eixo}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={addIndicador} sx={{ mt: 2 }}>Adicionar Indicador</Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/')} sx={{ mt: 2 }}>Voltar ao Início</Button>
      </Box>
      <Paper sx={{ overflowX: 'auto', mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome Indicador</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Tema</TableCell>
              <TableCell>Eixo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {indicadores.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {indicadorEditando?.id === item.id ? (
                    <TextField
                      value={indicadorEditando?.nomeIndicador || ''}
                      onChange={(e) =>
                        setIndicadorEditando({ ...indicadorEditando, nomeIndicador: e.target.value })
                      }
                    />
                  ) : (
                    item.nomeindicador
                  )}
                </TableCell>
                <TableCell>
                  {indicadorEditando?.id === item.id ? (
                    <Select
                      value={indicadorEditando?.tipo || ''}
                      onChange={(e) =>
                        setIndicadorEditando({ ...indicadorEditando, tipo: e.target.value })
                      }
                    >
                      <MenuItem value="Moeda">Moeda</MenuItem>
                      <MenuItem value="Percentual">Percentual</MenuItem>
                      <MenuItem value="Número">Número</MenuItem>
                    </Select>
                  ) : (
                    item.tipo
                  )}
                </TableCell>
                <TableCell>{item.tema}</TableCell>
                <TableCell>{item.eixo}</TableCell>
                <TableCell>
                  {indicadorEditando?.id === item.id ? (
                    <Button onClick={updateIndicadorHandle}>Salvar</Button>
                  ) : (
                    <Button onClick={() => setIndicadorEditando({ ...item })}>Editar</Button>
                  )}
                  <Button color="secondary" onClick={() => deleteIndicadorHandle(item.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Indicadores;
