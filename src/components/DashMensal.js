// esg-frontend/src/components/DashMensal.js

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, FormControl, Select, MenuItem, Typography, Box } from '@mui/material';
import { getRelatorioGeral } from '../services/Api';

const DashMensal = () => {
    const [data, setData] = useState([]);
    const [selectedIndicators, setSelectedIndicators] = useState(Array(3).fill(''));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        getRelatorioGeral().then(relatorio => {
            if (Array.isArray(relatorio)) {
                setData(relatorio);
            } else {
                console.error('Formato de dados recebidos inesperado:', relatorio);
                setData([]);
                setError('Formato de dados inesperado');
            }
            setIsLoading(false);
        }).catch(err => {
            console.error('Erro ao buscar dados:', err);
            setError('Falha ao carregar dados');
            setIsLoading(false);
        });
    }, []);

    const handleSelectChange = (index) => (event) => {
        const newIndicators = [...selectedIndicators];
        newIndicators[index] = event.target.value;
        setSelectedIndicators(newIndicators);
    };

    const generateChartData = (indicatorId) => {
        const indicatorData = data.find(ind => ind.indicador === indicatorId);
        console.log("Dados do indicador selecionado:", indicatorData); // Log para verificar os dados processados

        if (!indicatorData) {
            return { labels: [], datasets: [] };
        }

        const months = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const metaData = months.map(month => indicatorData[`meta_${month.toLowerCase()}`]);
        const resultadoData = months.map(month => indicatorData[`resultado_${month.toLowerCase()}`]);

        console.log("Dados do gráfico - Meta:", metaData);
        console.log("Dados do gráfico - Realizado:", resultadoData);

        return {
            labels: months,
            datasets: [{
                label: 'Meta',
                data: metaData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Realizado',
                data: resultadoData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    };

    if (isLoading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6">Dados Mensais</Typography>
            <Typography variant="h">Escolha os Indicadores</Typography>
            {selectedIndicators.map((selectedIndicator, index) => (
                <FormControl fullWidth key={index}>
                    
                    <Select
                        value={selectedIndicator}
                        onChange={handleSelectChange(index)}
                        displayEmpty
                    >
                        <MenuItem value=""><em>Nenhum</em></MenuItem>
                        {data.filter(indicator => 
                            !selectedIndicators.includes(indicator.indicador) || indicator.indicador === selectedIndicator
                        ).map(indicator => (
                            <MenuItem key={indicator.indicador} value={indicator.indicador}>
                                {indicator.indicador}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ))}
            {selectedIndicators.map((indicatorId, idx) => (
                indicatorId && <Card variant="outlined" sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={indicatorId + idx}>
                    <CardContent>
                        <Typography variant="h5">{data.find(ind => ind.indicador === indicatorId)?.indicador}</Typography>
                        <Typography variant="subtitle1">Meta Total: {data.find(ind => ind.indicador === indicatorId)?.metatotal}</Typography>
                        <Typography variant="subtitle1">Resultado Total: {data.find(ind => ind.indicador === indicatorId)?.realizadototal}</Typography>
                        <Typography variant="subtitle1">% Conclusão: {data.find(ind => ind.indicador === indicatorId)?.percentual_acoes}</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                        <div style={{ flex: '1', height: '1000px', width: '100%', minWidth: '1000px' }}>
                            <Bar data={generateChartData(indicatorId)} options={{ responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true } } }} />
                        </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default DashMensal;
