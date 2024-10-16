// esg-frontend/src/components/Metas.js

import React, { useState, useEffect } from 'react';
import {
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { getIndicators, saveMetas, editMeta, deleteMeta } from '../services/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Metas = () => {
  const [metas, setMetas] = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [novaMeta, setNovaMeta] = useState({
    indicador: '',
    tipo: '',
    janeiro: 0,
    fevereiro: 0,
    marco: 0,
    abril: 0,
    maio: 0,
    junho: 0,
    julho: 0,
    agosto: 0,
    setembro: 0,
    outubro: 0,
    novembro: 0,
    dezembro: 0,
    total: 0,
  });
  const [editMode, setEditMode] = useState(null);
  const [showForm, setShowForm] = useState(false); // Controla se o formulário será exibido

  useEffect(() => {
    async function fetchIndicadores() {
      try {
        const indicators = await getIndicators();
        setIndicadores(indicators);
      } catch (err) {
        console.error('Error loading indicators:', err.message);
      }
    }

    async function fetchMetas() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/meta`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMetas(data);
      } catch (err) {
        console.error('Error loading metas:', err.message);
      }
    }

    fetchIndicadores();
    fetchMetas(); // Carregar metas automaticamente ao carregar a página
  }, []);

  const handleIndicadorChange = (event) => {
    const selectedIndicador = event.target.value;
    const found = indicadores.find(ind => ind.nomeindicador === selectedIndicador);

    setNovaMeta(prev => ({
      ...prev,
      indicador: found ? found.nomeindicador : '',
      tipo: found ? found.tipo : ''
    }));
  };

  // Função para adicionar a nova meta
  const handleAddMeta = async () => {
    try {
      const response = await saveMetas(novaMeta); // Chama a função saveMetas para adicionar a nova meta
      setMetas(prevMetas => [...prevMetas, response]); // Adiciona a nova meta à lista localmente
      // Limpa os campos do formulário
      setNovaMeta({
        indicador: '',
        tipo: '',
        janeiro: 0,
        fevereiro: 0,
        marco: 0,
        abril: 0,
        maio: 0,
        junho: 0,
        julho: 0,
        agosto: 0,
        setembro: 0,
        outubro: 0,
        novembro: 0,
        dezembro: 0,
        total: 0,
      });
      setShowForm(false); // Esconde o formulário após a inserção
    } catch (err) {
      console.error('Error adding meta:', err.message);
    }
  };

  // Função para alternar o modo de edição
  const toggleEditMode = (metaId) => {
    setEditMode(editMode === metaId ? null : metaId);
  };

  // Função para salvar a meta editada com confirmação
  const handleEditMeta = async (meta) => {
    if (window.confirm('Você realmente deseja salvar as alterações?')) {
      try {
        const updatedMeta = {
          id: meta.id,
          indicador: meta.indicador,
          tipo: meta.tipo,
          janeiro: Number(meta.janeiro) || 0,
          fevereiro: Number(meta.fevereiro) || 0,
          marco: Number(meta.marco) || 0,
          abril: Number(meta.abril) || 0,
          maio: Number(meta.maio) || 0,
          junho: Number(meta.junho) || 0,
          julho: Number(meta.julho) || 0,
          agosto: Number(meta.agosto) || 0,
          setembro: Number(meta.setembro) || 0,
          outubro: Number(meta.outubro) || 0,
          novembro: Number(meta.novembro) || 0,
          dezembro: Number(meta.dezembro) || 0,
          total: Number(meta.total) || 0,
        };

        const response = await editMeta(updatedMeta);
        if (response) {
          setEditMode(null);
        }
      } catch (err) {
        console.error('Error editing meta:', err.message);
      }
    }
  };

  // Função para deletar a meta com confirmação
  const handleDeleteMeta = async (metaId) => {
    if (window.confirm('Você realmente deseja excluir esta meta?')) {
      try {
        await deleteMeta(metaId);
        setMetas(prevMetas => prevMetas.filter(meta => meta.id !== metaId));
      } catch (err) {
        console.error('Error deleting meta:', err.message);
      }
    }
  };

  // Função para lidar com mudanças nos meses na inserção de uma nova meta
  const handleNewMetaMonthChange = (month, value) => {
    const newValue = parseFloat(value) || 0;

    setNovaMeta(prev => {
      // Atualiza o valor do mês que foi alterado
      const updatedMeta = { ...prev, [month]: newValue };
      
      // Recalcula o total somando todos os meses
      const total = [
        'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 
        'junho', 'julho', 'agosto', 'setembro', 'outubro', 
        'novembro', 'dezembro'
      ].reduce((sum, key) => sum + (updatedMeta[key] || 0), 0);

      // Retorna o estado atualizado com o novo total
      return { ...updatedMeta, total };
    });
  };

  // Função para lidar com mudanças nos meses na edição de uma meta existente
  const handleMonthChange = (metaId, month, value) => {
    const numberValue = parseFloat(value) || 0;
    setMetas(prevMetas =>
      prevMetas.map(meta =>
        meta.id === metaId
          ? {
              ...meta,
              [month]: numberValue,
              total: Object.keys(meta).reduce(
                (sum, key) => (['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'].includes(key) ? sum + Number(meta[key] || 0) : sum),
                0
              ),
            }
          : meta
      )
    );
  };

  // Função para formatar os valores para exibição
  const formatValueForDisplay = (value, type) => {
    if (type === 'Número') {
      return parseFloat(value).toFixed(1).replace('.', ',');
    } else if (type === 'Percentual') {
      return `${parseFloat(value).toFixed(2)}%`;
    } else if (type === 'Moeda') {
      return `R$${parseFloat(value).toFixed(2)}`;
    } else {
      return value;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Metas
      </Typography>

      {/* Botão para exibir o formulário de inserção */}
      {!showForm && (
        <Button variant="contained" color="primary" onClick={() => setShowForm(true)} sx={{ mt: 2 }}>
          Inserir Meta
        </Button>
      )}

      {/* Formulário de inserção de meta, visível apenas quando showForm for true */}
      {showForm && (
        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
          <FormControl fullWidth>
            <InputLabel id="indicador-label">Indicador</InputLabel>
            <Select
              labelId="indicador-label"
              id="indicador-select"
              value={novaMeta.indicador}
              onChange={handleIndicadorChange}
            >
              {indicadores.map((ind) => (
                <MenuItem key={ind.id} value={ind.nomeindicador}>
                  {ind.nomeindicador}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Tipo" fullWidth value={novaMeta.tipo} disabled />

          {[
            'janeiro',
            'fevereiro',
            'marco',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro',
          ].map((mes) => (
            <TextField
              key={mes}
              label={mes.charAt(0).toUpperCase() + mes.slice(1)}
              type="number"
              fullWidth
              value={novaMeta[mes]}
              onChange={(e) => handleNewMetaMonthChange(mes, e.target.value)}
            />
          ))}

          <TextField label="Total" type="number" fullWidth value={novaMeta.total} disabled />

          <Button variant="contained" color="primary" onClick={handleAddMeta} sx={{ mt: 2 }}>
            Adicionar Meta
          </Button>
        </Box>
      )}

      {metas.length > 0 && (
        <Paper sx={{ overflowX: 'auto', mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Indicador</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Total</TableCell>
                {[
                  'Janeiro',
                  'Fevereiro',
                  'Março',
                  'Abril',
                  'Maio',
                  'Junho',
                  'Julho',
                  'Agosto',
                  'Setembro',
                  'Outubro',
                  'Novembro',
                  'Dezembro',
                ].map((mes) => (
                  <TableCell key={mes}>{mes}</TableCell>
                ))}
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {metas.map((meta) => (
                <TableRow key={meta.id}>
                  <TableCell>{meta.id}</TableCell>
                  <TableCell>{meta.indicador}</TableCell>
                  <TableCell>{meta.tipo}</TableCell>
                  <TableCell>{formatValueForDisplay(meta.total, meta.tipo)}</TableCell>
                  {[
                    'janeiro',
                    'fevereiro',
                    'marco',
                    'abril',
                    'maio',
                    'junho',
                    'julho',
                    'agosto',
                    'setembro',
                    'outubro',
                    'novembro',
                    'dezembro',
                  ].map((mes) => (
                    <TableCell key={`${meta.id}-${mes}`}>
                      {editMode === meta.id ? (
                        <TextField
                          type="number"
                          value={meta[mes]}
                          onChange={(e) => handleMonthChange(meta.id, mes, e.target.value)}
                        />
                      ) : (
                        formatValueForDisplay(meta[mes], meta.tipo)
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => toggleEditMode(meta.id)}>
                      <EditIcon />
                    </IconButton>
                    {editMode === meta.id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditMeta(meta)}
                      >
                        Salvar
                      </Button>
                    ) : (
                      <IconButton onClick={() => handleDeleteMeta(meta.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default Metas;
