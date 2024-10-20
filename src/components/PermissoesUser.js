// esg-frontend/src/components/PermissoesUser.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Select, MenuItem,
  TextField, FormControl, InputLabel, Table, TableBody,
  TableCell, TableHead, TableRow, Checkbox, List, ListItem, ListItemText
} from '@mui/material';
import { registerCompanyAndUser, updateCompanyAndUser, getUsuarios, updatePermissoesEmpresa, getEmpresas, deleteUserAndCompany } from '../services/Api';

const PermissoesUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]); // Estado correto para empresas
  const [open, setOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [empresaPermissoes, setEmpresaPermissoes] = useState({});
  const [openModalPermissoes, setOpenModalPermissoes] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    email: '',
    password: '',
    role: 'Admin',  // Definir para 'Admin' ou 'User', se for um valor padrão aceitável
    name: '',
    empresa: '',
    plano: 'basic'  // Definir para 'basic' ou 'premium', se for um valor padrão aceitável
  });

  const navigate = useNavigate();

  // Submenus definition should be outside of any function but inside the component to ensure it's defined
  const submenus = {
    indicadoresEMetas: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "ABNT PR 2030", path: "/abnt" },
      { name: "Indicadores", path: "/indicadores" },
      { name: "Metas", path: "/metas" },
      { name: "Resultados", path: "/resultados" },
      { name: "Planejamentos", path: "/planejamentos" },
      { name: "Relatórios Geral", path: "/relatoriogeral" },
      { name: "Relatórios ESG", path: "/relatorioesg" },
      { name: "Relatórios Planejamento", path: "/relatorioplanejamento" }
    ],
    analiseEsg: [
      { name: "Análise de SA", path: "/analisesa" },
      { name: "Meio Ambiente", path: "/meioambiente" },
      { name: "Social", path: "/social" },
      { name: "Governança", path: "/governanca" },
      { name: "Análise ESG", path: "/analiseesg" },
      { name: "ESG Road Map", path: "/roadmap" },
      { name: "Relatório de Ações", path: "/relatorioacoes" }
    ],
    userManagement: [
      { name: "Empresas e Usuários", path: "/permicoesuser" }
    ],
    settings: [
      { name: "Configurações da Empresa", path: "/configuracoesempresa" }
    ]
  };

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const fetchedUsuarios = await getUsuarios();
        setUsuarios(fetchedUsuarios);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    }

    async function fetchEmpresas() {
      try {
        const fetchedEmpresas = await getEmpresas();
        setEmpresas(fetchedEmpresas); // Carrega as empresas corretamente
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    }

    fetchUsuarios();
    fetchEmpresas();
  }, []);

  useEffect(() => {
    const permissions = localStorage.getItem('empresaPermissoes');
    if (permissions) {
      setEmpresaPermissoes(JSON.parse(permissions));
    } else {
      console.log('Nenhuma permissão encontrada no localStorage.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('empresaPermissoes', JSON.stringify(empresaPermissoes));
  }, [empresaPermissoes]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Isso garantirá que cada input atualize corretamente o estado
    }));
  };

  const handleRegister = async () => {
    const { email, password, role, name, empresa, plano } = formData; // Certifique-se de extrair o plano
  
    if (!email || !password || !role || !name || !empresa || !plano) {
      alert('Por favor, preencha todos os campos necessários.');
      return;
    }
  
    const roleFormatted = role.toLowerCase();
    try {
      const newUser = await registerCompanyAndUser(email, password, roleFormatted, name, empresa, plano);  // Inclua plano aqui
      console.log("Empresa e usuário criados com sucesso:", newUser);
      setUsuarios([...usuarios, newUser]); // Adiciona novo usuário à lista
      handleClose();
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
      alert('Erro ao registrar usuário: ' + error.message);
    }
  };

  const handleCloseModalPermissoes = () => {
    setOpenModalPermissoes(false);
    setSelectedEmpresa(null);
  };

  const handleTogglePermission = (menu) => {
    setEmpresaPermissoes(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleSavePermissions = async () => {
    if (selectedEmpresa) {
      try {
        await updatePermissoesEmpresa(selectedEmpresa.id, empresaPermissoes);
        localStorage.setItem('empresaPermissoes', JSON.stringify(empresaPermissoes));
        window.location.reload();
      } catch (error) {
        console.error('Erro ao salvar permissões:', error);
        alert('Erro ao salvar permissões.');
      }
    }
  };

  const handleDeleteUserConfirmation = (userId) => {
    setUserIdToDelete(userId);
    setOpenConfirmDelete(true);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserAndCompany(userIdToDelete);
      setUsuarios(usuarios.filter(user => user.id !== userIdToDelete));
      setOpenConfirmDelete(false);
      alert('Usuário e empresa associada deletados com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário: ' + error.message);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'superadmin') {
      alert('Acesso restrito apenas para Superadmin.');
      navigate('/');
    }
  }, [navigate]);

  const handleOpenRegister = () => {
    // Define o estado inicial para registro
    setFormData({
      id: null,
      email: '',
      password: '',
      role: 'Admin',
      name: '',
      empresa: '', // Garante que está vazio ao abrir para registro
      plano: 'basic'
    });
    setOpen(true);
  };

  const handleEditUser = (user) => {
    // Carrega os dados do usuário para edição
    setFormData({
      id: user.id,
      email: user.email,
      password: '', // Senha não carregada por segurança
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase(),
      name: user.name,
      empresa: user.empresa_name,
      plano: user.plano
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    const roleFormatted = formData.role.toLowerCase();
    const dataToSend = {
      email: formData.email,
      role: roleFormatted,
      name: formData.name,
      empresa: formData.empresa,
      plano: formData.plano === 'Completo' ? 'full' : 'basic'
    };
  
    try {
      const updatedUser = await updateCompanyAndUser(formData.id, dataToSend);
      console.log("Usuário e empresa atualizados com sucesso:", updatedUser);
      setUsuarios(usuarios.map(user => user.id === formData.id ? { ...user, ...formData } : user));
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message);
      alert('Erro ao atualizar usuário: ' + error.message);
    }
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const handleOpenDeleteConfirm = (userId) => {
    setUserIdToDelete(userId);
    setOpenConfirmDelete(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenConfirmDelete(false);
  };
  
  const handleOpenPlanChangeDialog = (userId) => {
    // Abra um diálogo ou atualize o estado para permitir a mudança de plano
  };

  return (
    <div>
      <h1>Configuração de Permissões dos Usuários e Empresas</h1>
      {/* Lista de Usuários */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Função</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Plano</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map(usuario => (
            <TableRow key={`${usuario.id}-${usuario.email}`}>
              <TableCell>{usuario.id}</TableCell>
              <TableCell>{usuario.name}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.role}</TableCell>
              <TableCell>{usuario.empresa_name || 'Não definida'}</TableCell>
              <TableCell>{usuario.plano}</TableCell>
              <TableCell>
              <Button onClick={() => handleEditUser(usuario)}>Editar</Button>
              <Button onClick={() => handleDeleteUserConfirmation(usuario.id)} style={{ marginLeft: "10px" }} color="secondary">
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="outlined" onClick={handleOpen}>
        Registrar Nova Empresa e Usuário
      </Button>
  
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? "Editar Empresa e Usuário" : "Registrar Nova Empresa e Usuário"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {formData.id ? "Atualize as informações do usuário e empresa." : "Preencha as informações para registrar uma nova empresa e usuário."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Senha"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={handleInputChange}
            disabled={!!formData.id}  // Desabilita campo senha se estiver editando
          />
          <TextField
            margin="dense"
            name="name"
            label="Nome"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleInputChange}
          />
          {formData.id ? (
            <FormControl fullWidth margin="dense" disabled={!!formData.id}>
              <InputLabel id="empresa-label">Empresa</InputLabel>
              <Select
                labelId="empresa-label"
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
              >
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.id} value={empresa.name}>
                    {empresa.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              margin="dense"
              name="empresa"
              label="Nome da Empresa"
              fullWidth
              variant="standard"
              value={formData.empresa}
              onChange={handleInputChange}
            />
          )}
          <FormControl fullWidth margin="dense" disabled={!!formData.id}>
            <InputLabel id="plano-label">Plano</InputLabel>
            <Select
              labelId="plano-label"
              name="plano"
              value={formData.plano}
              onChange={handleInputChange}
              disabled={!!formData.id}  // Desabilita seleção de plano se estiver editando
            >
              <MenuItem value="basic">Básico (Análise ESG)</MenuItem>
              <MenuItem value="full">Completo (Análise ESG e Indicadores e Metas)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {formData.id ? (
            <Button onClick={() => handleUpdate(formData.id)}>Salvar</Button>
          ) : (
            <Button onClick={handleRegister}>Registrar</Button>
          )}
        </DialogActions>
      </Dialog>
  
      <Dialog open={openModalPermissoes} onClose={handleCloseModalPermissoes}>
        <DialogTitle>Editar Permissões para {selectedEmpresa?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecione os menus que estarão disponíveis para esta empresa.
          </DialogContentText>
          <List>
            {Object.keys(submenus).map(category => (
              submenus[category].map(menu => (
                <ListItem key={menu.name}>
                  <Checkbox
                    checked={!!empresaPermissoes[menu.name]}
                    onChange={() => handleTogglePermission(menu.name)}
                  />
                  <ListItemText primary={menu.name} />
                </ListItem>
              ))
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalPermissoes}>Cancelar</Button>
          <Button onClick={handleSavePermissions}>Salvar</Button>
        </DialogActions>
      </Dialog>
  
      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PermissoesUser;
