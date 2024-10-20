// esg-frontend/src/components/Indicadores.js

import React, { useState, useEffect } from 'react';
import {
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Modal
} from '@mui/material';
import { getIndicators, saveIndicators, updateIndicador, deleteIndicador, getABNTInfo } from '../services/Api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Indicadores = () => {
  const [indicadores, setIndicadores] = useState([]);
  const [novoIndicador, setNovoIndicador] = useState({ nomeIndicador: '', tipo: '', tema: '', eixo: '' });
  const [temas, setTemas] = useState([]);
  const [eixos, setEixos] = useState([]);
  const [abntData, setAbntData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [indicadorEditando, setIndicadorEditando] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchInitialData() {
      const abntInfo = await getABNTInfo();
      setAbntData(abntInfo);
      setTemas([...new Set(abntInfo.map(item => item.temas))]);
      fetchData();
    }

    fetchInitialData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getIndicators();
      setIndicadores(data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const addIndicador = async () => {
    const indicadorData = { ...novoIndicador, empresa_id: usuario.empresa_id };
    await saveIndicators(indicadorData);
    fetchData();
    handleCloseModal();
  };

  const updateIndicadorHandle = async () => {
    const indicadorData = { ...indicadorEditando, empresa_id: usuario.empresa_id };
    await updateIndicador(indicadorEditando.id, indicadorData);
    fetchData();
    setIndicadorEditando(null);
  };

  const deleteIndicadorHandle = async (id) => {
    if (!window.confirm('Você tem certeza que deseja excluir este indicador?')) return;
    await deleteIndicador(id);
    fetchData();
  };

  const handleTemaChange = (temaSelecionado) => {
    setNovoIndicador({ ...novoIndicador, tema: temaSelecionado });
    const eixosFiltrados = abntData.filter(item => item.temas === temaSelecionado).map(item => item.eixo);
    setEixos(eixosFiltrados);
    setNovoIndicador(prev => ({ ...prev, eixo: eixosFiltrados[0] || '' }));
  };

  return (
    <Box sx={{ padding: 3, mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="h4" gutterBottom>Indicadores ESG</Typography>
      <Button variant="contained" onClick={handleOpenModal}>Adicionar Indicador</Button>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">Adicionar Novo Indicador</Typography>
          <TextField
            label="Nome do Indicador"
            fullWidth
            value={novoIndicador.nomeIndicador}
            onChange={e => setNovoIndicador({ ...novoIndicador, nomeIndicador: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={novoIndicador.tipo}
              onChange={e => setNovoIndicador({ ...novoIndicador, tipo: e.target.value })}
            >
              <MenuItem value="Moeda">Moeda</MenuItem>
              <MenuItem value="Percentual">Percentual</MenuItem>
              <MenuItem value="Número">Número</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tema</InputLabel>
            <Select
              value={novoIndicador.tema}
              onChange={e => handleTemaChange(e.target.value)}
            >
              {temas.map((tema, index) => <MenuItem key={index} value={tema}>{tema}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Eixo</InputLabel>
            <Select
              value={novoIndicador.eixo}
              onChange={e => setNovoIndicador({ ...novoIndicador, eixo: e.target.value })}
            >
              {eixos.map((eixo, index) => <MenuItem key={index} value={eixo}>{eixo}</MenuItem>)}
            </Select>
          </FormControl>
          <Button onClick={addIndicador} variant="contained" sx={{ mt: 2 }}>Salvar Indicador</Button>
        </Box>
      </Modal>
      <Paper sx={{ overflowX: 'auto', mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome do Indicador</TableCell>
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
                    onChange={(e) => setIndicadorEditando({ ...indicadorEditando, nomeIndicador: e.target.value })}
                  />
                ) : (
                    item.nomeindicador
                  )}
                </TableCell>
                <TableCell>
                  {indicadorEditando?.id === item.id ? (
                    <Select
                      value={indicadorEditando?.tipo || ''}
                      onChange={(e) => setIndicadorEditando({ ...indicadorEditando, tipo: e.target.value })}
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
                    <Button onClick={() => setIndicadorEditando(item)}>Editar</Button>
                  )}
                  <Button color="error" onClick={() => deleteIndicadorHandle(item.id)}>Excluir</Button>
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
