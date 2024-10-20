// esg-frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './components/UserContext'; // Certifique-se de que o caminho está correto
import LoginForm from './components/LoginForm';
import MainLayout from './components/MainLayout';
import AdminDashboard from './components/AdminDashboard';
import ABNTContent from './components/ABNTContent';
import Indicadores from './components/Indicadores'; 
import Metas from './components/Metas'; 
import Resultados from './components/Resultados';
import Planejamento from './components/Planejamentos';
import RelatorioGeral from './components/RelatorioGeral';
import RelatorioESG from './components/RelatorioESG';
import RelatorioPlanejamento from './components/RelatorioPlanejamento';
import MeioAmbiente from './components/MeioAmbiente';
import Social from './components/Social';
import Governanca from './components/Governanca';
import AnaliseESG from './components/AnaliseESG';
import RoadMap from './components/RoadMap';
import RelatorioAcoes from './components/RelatorioAcoes';
import AnaliseSA from './components/AnaliseSA';
import PermissoesConfig from './components/PermissoesConfig';
import PermissoesUser from './components/PermissoesUser';

const App = () => {
    const [isAuthenticated, setAuth] = useState(false);

    return (
        <Router>
            <UserProvider> {/* Envolve todas as rotas com o UserProvider */}
                <div className="App">
                    {isAuthenticated ? (
                        <Routes>
                            {/* Rotas protegidas, usando MainLayout com SideMenu */}
                            <Route element={<MainLayout />}>
                                <Route path="/dashboard" element={<AdminDashboard />} />
                                <Route path="/abnt" element={<ABNTContent />} />
                                <Route path="/indicadores" element={<Indicadores />} />
                                <Route path="/metas" element={<Metas />} />
                                <Route path="/resultados" element={<Resultados />} />
                                <Route path="/planejamentos" element={<Planejamento />} />
                                <Route path="/relatoriogeral" element={<RelatorioGeral />} />
                                <Route path="/relatorioesg" element={<RelatorioESG />} />
                                <Route path="/relatorioplanejamento" element={<RelatorioPlanejamento />} />
                                <Route path="/meioambiente" element={<MeioAmbiente />} />
                                <Route path="/social" element={<Social />} />
                                <Route path="/governanca" element={<Governanca />} />
                                <Route path="/analiseesg" element={<AnaliseESG />} />
                                <Route path="/roadmap" element={<RoadMap />} />
                                <Route path="/relatorioacoes" element={<RelatorioAcoes />} />
                                <Route path="/analisesa" element={<AnaliseSA />} />
                                <Route path="/permissoesconfig" element={<PermissoesConfig />} />
                                <Route path="/permicoesuser" element={<PermissoesUser />} />
                            </Route>

                            {/* Redirecionamento para a página inicial autenticada */}
                            <Route path="/" element={<Navigate replace to="/analiseesg" />} />
                        </Routes>
                    ) : (
                        // Formulário de login para usuários não autenticados
                        <LoginForm setAuth={setAuth} />
                    )}
                </div>
            </UserProvider>
        </Router>
    );
};

export default App;
