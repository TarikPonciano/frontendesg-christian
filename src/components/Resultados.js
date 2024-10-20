// esg-frontend/src/components/Resultados.js

import React, { useState, useEffect } from 'react';
import {
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { getResultados, saveResultados, editResultado, deleteResultado } from '../services/Api'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Resultados = () => {
  const [resultados, setResultados] = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [novoResultado, setNovoResultado] = useState({
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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchIndicadores() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/indicator`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        const data = await response.json();
        setIndicadores(data);
      } catch (err) {
        console.error('Erro ao carregar indicadores:', err.message);
      }
    }

    async function fetchResultados() {
      try {
        const data = await getResultados();
        setResultados(data);
      } catch (err) {
        console.error('Erro ao carregar resultados:', err.message);
      }
    }

    fetchIndicadores();
    fetchResultados();
  }, []);

  const handleIndicadorChange = (event) => {
    const selectedIndicador = event.target.value;
    const found = indicadores.find((ind) => ind.nomeindicador === selectedIndicador);

    setNovoResultado((prev) => ({
      ...prev,
      indicador: found ? found.nomeindicador : '',
      tipo: found ? found.tipo || '' : '',
    }));
  };

  // Função para lidar com a mudança de valor dos meses
  const handleMonthChange = (month, value) => {
    const numberValue = parseFloat(value) || 0;
    setNovoResultado((prev) => {
      const updatedValues = { ...prev, [month]: numberValue };
      updatedValues.total = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
        .reduce((sum, key) => sum + (updatedValues[key] || 0), 0);
      return updatedValues;
    });
  };

  // Função para lidar com a mudança de valor dos meses em modo de edição
  const handleEditMonthChange = (resultadoId, month, value) => {
    const numberValue = parseFloat(value) || 0;
    setResultados((prevResultados) => 
      prevResultados.map((resultado) =>
        resultado.id === resultadoId
          ? {
              ...resultado,
              [month]: numberValue, // Atualiza o mês alterado
              // Recalcula o total somando todos os meses
              total: ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
                .reduce((sum, key) => sum + (key === month ? numberValue : (parseFloat(resultado[key]) || 0)), 0),
            }
          : resultado
      )
    );
  };

  // Função para adicionar o novo resultado
  const addResultado = async () => {
    try {
        const data = await saveResultados(novoResultado);
        setResultados((prevResultados) => Array.isArray(prevResultados) ? [...prevResultados, data] : [data]);  // Corrigido para garantir que prevResultados seja um array
        setNovoResultado({
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
        setShowForm(false);
    } catch (err) {
        console.error('Erro ao adicionar resultado:', err.message);
    }
  };

  // Função para alternar o modo de edição
  const toggleEditMode = (resultadoId) => {
    setEditMode(editMode === resultadoId ? null : resultadoId);
  };

  // Função para salvar o resultado editado com confirmação
  const handleEditResultado = async (resultado) => {
    if (window.confirm('Você realmente deseja salvar as alterações?')) {
      try {
        const updatedResultado = { ...resultado };
        const response = await editResultado(updatedResultado);
        if (response) {
          setEditMode(null);
        }
      } catch (err) {
        console.error('Erro ao editar resultado:', err.message);
      }
    }
  };

  // Função para deletar o resultado com confirmação
  const handleDeleteResultado = async (resultadoId) => {
    if (window.confirm('Você realmente deseja excluir este resultado?')) {
      try {
        await deleteResultado(resultadoId);
        setResultados((prevResultados) => prevResultados.filter((resultado) => resultado.id !== resultadoId));
      } catch (err) {
        console.error('Erro ao excluir resultado:', err.message);
      }
    }
  };

  return (
    <Box sx={{ padding: 3, mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="h4" gutterBottom>
        Resultados
      </Typography>

      {!showForm && (
        <Button variant="contained" color="primary" onClick={() => setShowForm(true)} sx={{ mt: 2 }}>
          Inserir Resultado
        </Button>
      )}

      {showForm && (
        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
          <FormControl fullWidth>
            <InputLabel id="indicador-label">Indicador</InputLabel>
            <Select
              labelId="indicador-label"
              id="indicador-select"
              value={novoResultado.indicador}
              onChange={handleIndicadorChange}
            >
              {indicadores.map((ind) => (
                <MenuItem key={ind.id} value={ind.nomeindicador}>
                  {ind.nomeindicador}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Tipo" fullWidth value={novoResultado.tipo} disabled />

          {['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'].map((mes) => (
            <TextField
              key={mes}
              label={mes.charAt(0).toUpperCase() + mes.slice(1)}
              type="number"
              fullWidth
              value={novoResultado[mes]}
              onChange={(e) => handleMonthChange(mes, e.target.value)}
            />
          ))}

          <TextField label="Total" type="number" fullWidth value={novoResultado.total} disabled />

          <Button variant="contained" color="primary" onClick={addResultado} sx={{ mt: 2 }}>
            Adicionar Resultado
          </Button>
        </Box>
      )}
      {resultados.length > 0 && (
        <Paper sx={{ overflowX: 'auto', mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Indicador</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Total</TableCell>
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((mes) => (
                  <TableCell key={mes}>{mes}</TableCell>
                ))}
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.map((resultado) => (
                <TableRow key={resultado.id}>
                  <TableCell>{resultado.id}</TableCell>
                  <TableCell>{resultado.indicador}</TableCell>
                  <TableCell>{resultado.tipo}</TableCell>
                  <TableCell>{resultado.total}</TableCell>
                  {['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'].map((mes) => (
                    <TableCell key={`${resultado.id}-${mes}`}>
                      {editMode === resultado.id ? (
                        <TextField
                          type="number"
                          value={resultado[mes]}
                          onChange={(e) => handleEditMonthChange(resultado.id, mes, e.target.value)} // Usa a nova função
                        />
                      ) : (
                        resultado[mes]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => toggleEditMode(resultado.id)}>
                      <EditIcon />
                    </IconButton>
                    {editMode === resultado.id ? (
                      <Button variant="contained" color="primary" onClick={() => handleEditResultado(resultado)}>
                        Salvar
                      </Button>
                    ) : (
                      <IconButton onClick={() => handleDeleteResultado(resultado.id)}>
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

export default Resultados;
