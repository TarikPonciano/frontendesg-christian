// esg-frontend/src/components/RoadMap.js

import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getEnvironmentalData, getSocialData, getGovernanceData, getRoadMaps, updateRoadMap, saveRoadMap } from '../services/Api';

const RoadMap = () => {
  const [roadMap, setRoadMap] = useState({
    plano: '',
    categoria: '',
    area: '',
    data: '',
    responsavel: '',
    gastoplanejado: '',
    gastorealizado: '',
    status: '',
    observacoes: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [roadMaps, setRoadMaps] = useState([]); // Estado para armazenar os roadmaps existentes
  const [showForm, setShowForm] = useState(false); // Controla a exibição do formulário
  const [openDialog, setOpenDialog] = useState(false); // Controla a exibição do diálogo de confirmação

  useEffect(() => {
    fetchAllCategorias();
    fetchAllRoadMaps(); // Chama a função para buscar roadmaps ao carregar a página
  }, []);

  const fetchAllCategorias = async () => {
    try {
      const envData = await getEnvironmentalData();
      const socData = await getSocialData();
      const govData = await getGovernanceData();
      const allCategorias = [
        ...envData.map(item => ({ id: item.id, nome: item.categoria, area: 'Meio Ambiente' })),
        ...socData.map(item => ({ id: item.id, nome: item.categoria, area: 'Social' })),
        ...govData.map(item => ({ id: item.id, nome: item.categoria, area: 'Governança' }))
      ];
      setCategorias(allCategorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategorias([]);
    }
  };

  // Função para buscar todos os roadmaps
  const fetchAllRoadMaps = async () => {
    try {
      const response = await getRoadMaps(); // Faz a requisição para buscar roadmaps
      setRoadMaps(response); // Define os roadmaps no estado
    } catch (error) {
      console.error('Erro ao buscar roadmaps:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'categoria') {
      const categoriaSelecionada = categorias.find(cat => cat.nome === value);
      setRoadMap(prev => ({
        ...prev,
        categoria: value,
        area: categoriaSelecionada ? categoriaSelecionada.area : ''
      }));
    } else {
      setRoadMap(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setOpenDialog(true); // Abre a caixa de diálogo de confirmação
  };

  // Confirmação de salvar alterações
  const confirmSave = async () => {
    try {
      if (roadMap.id) {
        await updateRoadMap(roadMap.id, roadMap); // Atualiza o roadmap
      } else {
        await saveRoadMap(roadMap); // Salva um novo roadmap
      }
      fetchAllRoadMaps(); // Atualiza a lista de roadmaps após salvar
      setOpenDialog(false); // Fecha o diálogo de confirmação
      setShowForm(false); // Oculta o formulário após salvar
    } catch (error) {
      console.error('Erro ao salvar RoadMap:', error);
    }
  };

    // Converte a data ISO para o formato brasileiro DD/MM/AAAA
    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString('pt-BR');
    };

    // Função para formatar a data no formato ISO para uso no campo de entrada de data
    const formatISODate = (dateStr) => {
      if (!dateStr) return '';  // Retorna uma string vazia se não houver data válida
      const date = new Date(dateStr);
      if (isNaN(date)) return '';  // Se a data for inválida, retorna uma string vazia
      return date.toISOString().split('T')[0];  // Retorna data no formato 'yyyy-MM-dd'
    }

  // Função para formatar valores em formato de moeda
  const formatCurrency = (value) => {
    if (isNaN(value)) return value; // Se o valor não for numérico, retorna o valor original
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para carregar os dados de um roadmap específico no formulário
  const loadRoadMapForEdit = (roadMapData) => {
    setRoadMap({
      ...roadMapData,
      data: roadMapData.data ? formatISODate(roadMapData.data) : '', // Garante que a data seja formatada ou vazia
    });
    setShowForm(true); // Mostra o formulário
  };

  // Função para resetar o formulário para adicionar novo roadmap
  const addNewRoadMap = () => {
    setRoadMap({
      plano: '',
      categoria: '',
      area: '',
      data: '',
      responsavel: '',
      gastoplanejado: '',
      gastorealizado: '',
      status: '',
      observacoes: ''
    });
    setShowForm(true); // Mostra o formulário para adicionar
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={addNewRoadMap}>
        Adicionar RoadMap
      </Button>

      {/* Tabela para exibir os roadmaps existentes */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Plano</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Área</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Responsável</TableCell>
            <TableCell>Gasto Planejado</TableCell>
            <TableCell>Gasto Realizado</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Observações</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roadMaps.map((roadMap) => (
            <TableRow key={roadMap.id}>
              <TableCell>{roadMap.plano}</TableCell>
              <TableCell>{roadMap.categoria}</TableCell>
              <TableCell>{roadMap.area}</TableCell>
              <TableCell>{formatDate(roadMap.data)}</TableCell>
              <TableCell>{roadMap.responsavel}</TableCell>
              <TableCell>{formatCurrency(roadMap.gastoplanejado)}</TableCell>
              <TableCell>{formatCurrency(roadMap.gastorealizado)}</TableCell>
              <TableCell>{roadMap.status}</TableCell>
              <TableCell>{roadMap.observacoes}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => loadRoadMapForEdit(roadMap)}>Alterar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Formulário para criar ou editar roadmaps */}
      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            label="Plano de Ação"
            variant="outlined"
            fullWidth
            name="plano"
            value={roadMap.plano}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth>
            <InputLabel id="categoria-label">Categoria</InputLabel>
            <Select
              labelId="categoria-label"
              name="categoria"
              value={roadMap.categoria}
              onChange={handleChange}
              label="Categoria"
              required
            >
              {categorias.map((categoria, index) => (
                <MenuItem key={`${categoria.id}-${index}`} value={categoria.nome}>
                  {categoria.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled>
            <InputLabel>Área</InputLabel>
            <Select
              name="area"
              value={roadMap.area}
              label="Área"
              required
            >
              {['Meio Ambiente', 'Social', 'Governança'].map(area => (
                <MenuItem key={area} value={area}>{area}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Data"
            fullWidth
            name="data"
            value={formatISODate(roadMap.data)}  // Usa a função formatISODate para garantir o formato correto
            onChange={handleChange}
            required
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Responsável"
            variant="outlined"
            fullWidth
            name="responsavel"
            value={roadMap.responsavel}
            onChange={handleChange}
            required
          />
          <TextField
            label="Gasto Planejado"
            variant="outlined"
            fullWidth
            name="gastoplanejado"
            value={roadMap.gastoplanejado}
            onChange={handleChange}
            required
          />
          <TextField
            label="Gasto Realizado"
            variant="outlined"
            fullWidth
            name="gastorealizado"
            value={roadMap.gastorealizado}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={roadMap.status}
              onChange={handleChange}
              label="Status"
              required
            >
              <MenuItem value="Não Iniciado">Não Iniciado</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Atrasado">Atrasado</MenuItem>
              <MenuItem value="Concluído">Concluído</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Observações"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="observacoes"
            value={roadMap.observacoes}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </form>
      )}

      {/* Caixa de diálogo de confirmação */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Alterações</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja salvar as alterações?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmSave} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoadMap;
