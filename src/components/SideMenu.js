// esg-frontend/src/components/SideMenu.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Ajuste o caminho conforme necessário
import { List, ListItemIcon, ListItemText, Collapse, Drawer, CssBaseline, ListItemButton } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';

const SideMenu = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState({
      indicadoresEMetas: false,
      analiseEsg: false,
      userManagement: false,
      settings: false,
    });
  
    const userContext = useContext(UserContext);
  
    if (!userContext) {
        console.log('Contexto de usuário ainda não está disponível.');
        return <div>Loading...</div>;
    }
  
    const { plano } = userContext; // Agora seguro para desestruturar, dado que sabemos que não é nulo
  
    const handleMenuClick = (menu) => {
      setOpen((prevState) => ({
        ...prevState,
        [menu]: !prevState[menu],
      }));
    };

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
        menuSuperadmin: [
          { name: "Empresas e Usuários", path: "/permicoesuser" }
        ],
        configuracoes: [
          { name: "Configurações da Empresa", path: "/configuracoesempresa" }
        ]
  };

  return (
    <>
      <CssBaseline />
      <Drawer
          variant="persistent"
          open={true}
          sx={{
              width: 240,
              '& .MuiDrawer-paper': {
                  width: 240,
                  boxSizing: 'border-box',
                  overflowY: 'auto',
                  height: '100vh',
                  position: 'fixed',
                  top: 0,
                  backgroundColor: 'darkblue',
              },
          }}
      >
          <List sx={{ paddingTop: '60px', color: 'white' }}>
              {/* Condicionalmente renderizando menus com base no plano */}
              {plano === 'full' && (
                  <>
                      {/* Renderiza todos os menus para plano "full" */}
                      {Object.entries(submenus).map(([key, items]) => (
                          <React.Fragment key={key}>
                              <ListItemButton onClick={() => handleMenuClick(key)}>
                                  <ListItemIcon sx={{ color: 'white' }}>{items[0].icon}</ListItemIcon>
                                  <ListItemText primary={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()} />
                                  {open[key] ? <ExpandLess /> : <ExpandMore />}
                              </ListItemButton>
                              <Collapse in={open[key]} timeout="auto" unmountOnExit>
                                  <List component="div" disablePadding>
                                      {items.map((submenu) => (
                                          <ListItemButton
                                              key={submenu.name}
                                              sx={{ pl: 4 }}
                                              onClick={() => navigate(submenu.path)}
                                          >
                                              <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                                              <ListItemText primary={submenu.name} />
                                          </ListItemButton>
                                      ))}
                                  </List>
                              </Collapse>
                          </React.Fragment>
                      ))}
                  </>
              )}

              {/* Renderiza apenas o menu ESG Analysis para plano "basic" */}
              {plano === 'basic' && (
                  <>
                      <ListItemButton onClick={() => handleMenuClick('analiseEsg')}>
                          <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
                          <ListItemText primary="Análise ESG" />
                          {open.analiseEsg ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open.analiseEsg} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                              {submenus.analiseEsg.map((submenu) => (
                                  <ListItemButton
                                      key={submenu.name}
                                      sx={{ pl: 4 }}
                                      onClick={() => navigate(submenu.path)}
                                  >
                                      <ListItemIcon sx={{ color: 'white' }}>{submenu.icon}</ListItemIcon>
                                      <ListItemText primary={submenu.name} />
                                  </ListItemButton>
                              ))}
                          </List>
                      </Collapse>
                  </>
              )}
          </List>
      </Drawer>
    </>
  );
};

export default SideMenu;
