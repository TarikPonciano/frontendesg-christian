// esg-frontend/src/components/Planejamentos.js

import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Select, MenuItem,
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, InputLabel, FormControl
} from '@mui/material';
import { getPlanejamento, updatePlanejamento, deletePlanejamento, savePlanejamento } from '../services/Api';

const Planejamento = () => {
  const [planejamentos, setPlanejamentos] = useState([]);
  const [editChanges, setEditChanges] = useState({});
  const [editMode, setEditMode] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [indicadores, setIndicadores] = useState([]);
  const [novoPlanejamento, setNovoPlanejamento] = useState({
    indicador: '',
    eixo: '',
    tema: '',
    responsavel: '',
    prazo: '',
    status: ''
  });

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
    fetchIndicadores();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const planejamentoData = await getPlanejamento();
      if (Array.isArray(planejamentoData)) {
        const formattedData = planejamentoData.map(item => ({
          ...item,
          prazo: formatDateForInput(item.prazo)
        }));
        setPlanejamentos(formattedData);
      } else {
        console.error('Expected an array from getPlanejamento, got:', planejamentoData);
      }
    };
    fetchData();
  }, []);

  const handleIndicadorChange = (event) => {
    const { value } = event.target;
    const selectedIndicador = indicadores.find(ind => ind.nomeindicador === value);
  
    if (selectedIndicador) {
      setNovoPlanejamento({
        ...novoPlanejamento,
        indicador: value,
        eixo: selectedIndicador.eixo,
        tema: selectedIndicador.tema,
      });
    } else {
      setNovoPlanejamento({
        ...novoPlanejamento,
        indicador: '',
        eixo: '',
        tema: '',
      });
    }
  };

  const handleInputChange = (event, field, id = null) => {
    const { value } = event.target;
  
    if (id !== null) {  // Se houver um 'id', significa que estamos editando um planejamento existente
      setEditChanges(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value  // Atualiza o campo editado
        }
      }));
    } else {
      // Caso contrário, estamos adicionando um novo planejamento
      setNovoPlanejamento(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await savePlanejamento(novoPlanejamento);
      setPlanejamentos([...planejamentos, { ...novoPlanejamento, id: result.id }]);
      setNovoPlanejamento({
        indicador: '',
        eixo: '',
        tema: '',
        responsavel: '',
        prazo: '',
        status: ''
      });
      setShowForm(false);
      alert('Planejamento adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar planejamento: ' + error.message);
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
  
    // Verifica se a data está no formato ISO com "T"
    if (dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0]; // Remove a hora se presente
    }
  
    // Tenta criar um objeto de data
    const date = new Date(dateStr);
      
    // Verifica se a data é válida
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`; // Retorna no formato yyyy-MM-dd para compatibilidade com HTML5 date input
    } else {
      return ''; // Retorna uma string vazia se a data for inválida
    }
  };

  // Função para alternar o modo de edição
  const toggleEdit = (id) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (!editMode[id]) {
      const found = planejamentos.find(p => p.id === id);
      setEditChanges({
        ...editChanges,
        [id]: {
          ...found,
          prazo: formatDateForInput(found.prazo)  // Assegura que o formato da data está correto para a entrada
        }
      });
    } else {
      const { [id]: removed, ...rest } = editChanges;
      setEditChanges(rest);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este planejamento?')) {
      try {
        await deletePlanejamento(id);
        setPlanejamentos(planejamentos.filter(p => p.id !== id));
        alert('Planejamento excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir planejamento:', error.message);
        alert('Erro ao excluir planejamento: ' + error.message);
      }
    }
  };  

  const handleSaveChanges = async (id) => {
    if (window.confirm('Tem certeza que deseja salvar as alterações?')) {
      try {
        const updatedData = editChanges[id];
        const response = await updatePlanejamento(id, updatedData);
        setPlanejamentos(planejamentos.map(p => p.id === id ? { ...p, ...response } : p));
        toggleEdit(id);
        alert('Planejamento atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar as alterações:', error);
      }
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Planejamento</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
      >
        {showForm ? "Cancelar" : "Adicionar Planejamento"}
      </Button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="indicador-label">Indicador</InputLabel>
            <Select
              labelId="indicador-label"
              value={novoPlanejamento.indicador || ''}
              onChange={handleIndicadorChange}
            >
              {indicadores.map(option => (
                <MenuItem key={option.id} value={option.nomeindicador}>{option.nomeindicador}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Eixo"
            value={novoPlanejamento.eixo}
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{
              input: {
              readOnly: true,}
            }}
          />
          <TextField
            label="Tema"
            value={novoPlanejamento.tema}
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{
              input: {
              readOnly: true,}
            }}
          />
          <TextField
            label="Responsável"
            value={novoPlanejamento.responsavel}
            onChange={(e) => handleInputChange(e, 'responsavel')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Prazo"
            type="date"
            value={formatDateForInput(novoPlanejamento.prazo)}
            onChange={(e) => handleInputChange(e, 'prazo')}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Select
            value={novoPlanejamento.status}
            onChange={(e) => handleInputChange(e, 'status')}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Não iniciado">Não iniciado</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Atrasado">Atrasado</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Salvar Planejamento
          </Button>
        </form>
      )}
      <Paper sx={{ overflowX: 'auto', mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Indicador</TableCell>
              <TableCell>Eixo</TableCell>
              <TableCell>Tema</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Prazo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planejamentos.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {editMode[item.id] ? (
                    <Select
                      label="Indicador"
                      value={editChanges[item.id]?.indicador || item.indicador}
                      onChange={(e) => handleInputChange(e, 'indicador', item.id)}
                      fullWidth
                    >
                      {indicadores.map((indicador) => (
                        <MenuItem key={indicador.id} value={indicador.nomeindicador}>
                          {indicador.nomeindicador}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    item.indicador
                  )}
                </TableCell>
                <TableCell>{editMode[item.id] ? (
                  <TextField
                    value={editChanges[item.id]?.eixo || item.eixo}
                    onChange={(e) => handleInputChange(e, 'eixo', item.id)}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                ) : (
                  item.eixo
                )}
                </TableCell>
                <TableCell>{editMode[item.id] ? (
                  <TextField
                    value={editChanges[item.id]?.tema || item.tema}
                    onChange={(e) => handleInputChange(e, 'tema', item.id)}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                ) : (
                  item.tema
                )}
                </TableCell>
                <TableCell>{editMode[item.id] ? (
                  <TextField
                    value={editChanges[item.id]?.responsavel || item.responsavel}
                    onChange={(e) => handleInputChange(e, 'responsavel', item.id)}
                    fullWidth
                  />
                ) : (
                  item.responsavel
                )}
                </TableCell>
                <TableCell>
                  {editMode[item.id] ? (
                    <TextField
                      type="date"
                      value={editMode[item.id] ? formatDateForInput(editChanges[item.id]?.prazo) : formatDateForInput(item.prazo)}
                      onChange={(e) => handleInputChange(e, 'prazo', item.id)}
                      fullWidth
                    />
                  ) : (
                    formatDateForInput(item.prazo)
                  )}
                </TableCell>
                <TableCell>{editMode[item.id] ? (
                  <Select
                    value={editChanges[item.id]?.status || item.status}
                    onChange={(e) => handleInputChange(e, 'status', item.id)}
                    fullWidth
                  >
                    <MenuItem value="Não iniciado">Não iniciado</MenuItem>
                    <MenuItem value="Em andamento">Em andamento</MenuItem>
                    <MenuItem value="Atrasado">Atrasado</MenuItem>
                    <MenuItem value="Concluído">Concluído</MenuItem>
                  </Select>
                ) : (
                  item.status
                )}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => toggleEdit(item.id)}>
                    {editMode[item.id] ? 'Cancelar' : 'Editar'}
                  </Button>
                  {editMode[item.id] && (
                    <Button variant="contained" onClick={() => handleSaveChanges(item.id)} sx={{ ml: 1 }}>
                      Salvar
                    </Button>
                  )}
                  <Button variant="outlined" color="error" onClick={() => handleDelete(item.id)} sx={{ mt: 1 }}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Planejamento;
