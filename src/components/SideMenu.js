// esg-frontend/src/components/SideMenu.js


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    List,
    ListItemIcon,
    ListItemText,
    Collapse,
    Drawer,
    CssBaseline,
    ListItemButton
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NatureIcon from '@mui/icons-material/Nature';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const SideMenu = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState({
        indicatorsAndGoals: false,
        esgAnalysis: false,
        userManagement: false,
        settings: false,
    });

    const handleMenuClick = (menu) => {
        setOpen((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    };

    const submenus = {
        indicatorsAndGoals: [
            { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
            { name: "ABNT PR 2030", path: "/abnt", icon: <AssessmentIcon /> },
            { name: "Indicadores", path: "/indicadores", icon: <AssessmentIcon /> },
            { name: "Metas", path: "/metas", icon: <DashboardIcon /> },
            { name: "Resultados", path: "/resultados", icon: <DashboardIcon /> },
            { name: "Planejamentos", path: "/planejamentos", icon: <DashboardIcon /> },
            { name: "Relatórios Geral", path: "/relatoriogeral", icon: <AssessmentIcon /> },
            { name: "Relatórios ESG", path: "/relatorioesg", icon: <AssessmentIcon /> },
            { name: "Relatórios Planejamento", path: "/relatorioplanejamento", icon: <AssessmentIcon /> }
        ],
        esgAnalysis: [
            { name: "Análise de SA", path: "/analisesa", icon: <AssessmentIcon /> },
            { name: "Meio Ambiente", path: "/meioambiente", icon: <NatureIcon /> },
            { name: "Social", path: "/social", icon: <BusinessCenterIcon /> },
            { name: "Governança", path: "/governanca", icon: <BusinessCenterIcon /> },
            { name: "Análise ESG", path: "/analiseesg", icon: <AssessmentIcon /> },
            { name: "ESG Road Map", path: "/roadmap", icon: <AssessmentIcon /> },
            { name: "Relatório de Ações", path: "/relatorioacoes", icon: <AssessmentIcon /> }
        ],
        userManagement: [
            { name: "Usuários", path: "/usuarios", icon: <PersonIcon /> },
            { name: "Funções", path: "/funcoes", icon: <PersonIcon /> },
            { name: "Permissões", path: "/permicoesuser", icon: <PersonIcon /> }
        ],
        settings: [
            { name: "Configurações da Empresa", path: "/configuracoesempresa", icon: <SettingsIcon /> }
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
                    {/* Indicadores e Metas */}
                    <ListItemButton onClick={() => handleMenuClick('indicatorsAndGoals')}>
                        <ListItemIcon sx={{ color: 'white' }}><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Indicadores e Metas" />
                        {open.indicatorsAndGoals ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open.indicatorsAndGoals} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {submenus.indicatorsAndGoals.map((submenu) => (
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

                    {/* Análise ESG */}
                    <ListItemButton onClick={() => handleMenuClick('esgAnalysis')}>
                        <ListItemIcon sx={{ color: 'white' }}><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="Análise ESG" />
                        {open.esgAnalysis ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open.esgAnalysis} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {submenus.esgAnalysis.map((submenu) => (
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

                    {/* Gestão de Usuários */}
                    <ListItemButton onClick={() => handleMenuClick('userManagement')}>
                        <ListItemIcon sx={{ color: 'white' }}><PersonIcon /></ListItemIcon>
                        <ListItemText primary="Gestão de Usuários" />
                        {open.userManagement ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open.userManagement} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {submenus.userManagement.map((submenu) => (
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

                    {/* Configurações */}
                    <ListItemButton onClick={() => handleMenuClick('settings')}>
                        <ListItemIcon sx={{ color: 'white' }}><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Configurações" />
                        {open.settings ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open.settings} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {submenus.settings.map((submenu) => (
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
                </List>
            </Drawer>
        </>
    );
};

export default SideMenu;
