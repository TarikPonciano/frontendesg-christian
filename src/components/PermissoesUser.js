// esg-frontend/src/components/PermissoesUser.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Select, MenuItem,
  TextField, FormControl, InputLabel, Table, TableBody,
  TableCell, TableHead, TableRow, Checkbox, List, ListItem, ListItemText
} from '@mui/material';
import { registerCompanyAndUser, getUsuarios, updatePermissoesEmpresa } from '../services/Api';

const PermissoesUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [empresaPermissoes, setEmpresaPermissoes] = useState({});
  const [openModalPermissoes, setOpenModalPermissoes] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    name: '',
    empresa: ''
  });

  const navigate = useNavigate();

  // Submenus definition should be outside of any function but inside the component to ensure it's defined
  const submenus = {
    indicatorsAndGoals: [
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
    esgAnalysis: [
      { name: "Análise de SA", path: "/analisesa" },
      { name: "Meio Ambiente", path: "/meioambiente" },
      { name: "Social", path: "/social" },
      { name: "Governança", path: "/governanca" },
      { name: "Análise ESG", path: "/analiseesg" },
      { name: "ESG Road Map", path: "/roadmap" },
      { name: "Relatório de Ações", path: "/relatorioacoes" }
    ],
    userManagement: [
      { name: "Usuários", path: "/usuarios" },
      { name: "Funções", path: "/funcoes" },
      { name: "Permissões", path: "/permicoesuser" }
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
    fetchUsuarios();
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
      [name]: value
    }));
  };

  const handleRegister = async () => {
    handleClose();
    if (!['admin', 'user', 'superadmin'].includes(formData.role.toLowerCase())) {
      alert('Role inválido. Por favor, escolha entre admin, user ou superadmin.');
      return;
    }

    try {
      const newUser = await registerCompanyAndUser(formData.email, formData.password, formData.role.toLowerCase(), formData.name, formData.empresa);
      console.log("Empresa e usuário criados com sucesso:", newUser);
      setFormData({
        email: '',
        password: '',
        role: '',
        name: '',
        empresa: ''
      });
    } catch (error) {
      console.error("Erro ao criar empresa e usuário:", error);
    }
  };

  const handleEditPermissions = (empresa) => {
    setSelectedEmpresa(empresa);
    setEmpresaPermissoes(empresa.permissoes || {});
    setOpenModalPermissoes(true);
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'superadmin') {
      alert('Acesso restrito apenas para Superadmin.');
      navigate('/');
    }
  }, [navigate]);

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
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map(usuario => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.id}</TableCell>
              <TableCell>{usuario.name}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button variant="outlined" onClick={handleOpen}>
        Registrar Nova Empresa e Usuário
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registrar Empresa e Usuário</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Preencha as informações para registrar uma nova empresa e usuário.
          </DialogContentText>
          <TextField autoFocus margin="dense" name="email" label="Email" type="email" fullWidth variant="standard" value={formData.email} onChange={handleInputChange} />
          <TextField margin="dense" name="password" label="Senha" type="password" fullWidth variant="standard" value={formData.password} onChange={handleInputChange} />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Permissão</InputLabel>
            <Select labelId="role-label" name="role" value={formData.role} onChange={handleInputChange} label="Permissão">
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>
          <TextField margin="dense" name="name" label="Nome" fullWidth variant="standard" value={formData.name} onChange={handleInputChange} />
          <TextField margin="dense" name="empresa" label="Empresa" fullWidth variant="standard" value={formData.empresa} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleRegister}>Registrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalPermissoes} onClose={handleCloseModalPermissoes}>
        <DialogTitle>Editar Permissões para {selectedEmpresa?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecione os menus que estarão disponíveis para esta empresa.
          </DialogContentText>
          <List>
            {Object.keys(submenus).map(category => submenus[category].map(menu => (
              <ListItem key={menu.name}>
                <Checkbox
                  checked={!!empresaPermissoes[menu.name]}
                  onChange={() => handleTogglePermission(menu.name)}
                />
                <ListItemText primary={menu.name} />
              </ListItem>
            )))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalPermissoes}>Cancelar</Button>
          <Button onClick={handleSavePermissions}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PermissoesUser;
