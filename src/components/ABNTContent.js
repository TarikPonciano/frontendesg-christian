// esg-frontend/src/components/ABNTContent.js

import React, { useEffect, useState } from 'react';
import { Typography, Container, Box } from '@mui/material';
import { getABNTInfo } from '../services/Api';

const ABNTContent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getABNTInfo();
                setData(result);
            } catch (error) {
                console.error('Erro ao carregar informações da ABNT PR 2030:', error);
            }
        };

        fetchData();
    }, []);

    const getBackgroundColor = (eixo) => {
        switch (eixo) {
            case 'Ambiental': return 'lightgreen';
            case 'Social': return 'lightblue';
            case 'Governança': return 'lightcoral';  // Certifique-se de que este valor está correto.
            default: return 'none';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, ml: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem' }}>
                ABNT PR 2030 - Informações
            </Typography>
            {data.length > 0 ? (
                <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <Typography variant="h6" component="div" sx={{ backgroundColor: 'lightgray', p: 1, textAlign: 'center' }}>Temas</Typography>
                    <Typography variant="h6" component="div" sx={{ backgroundColor: 'lightgray', p: 1, textAlign: 'center' }}>Eixo</Typography>
                    <Typography variant="h6" component="div" sx={{ backgroundColor: 'lightgray', p: 1, textAlign: 'center' }}>Informações</Typography>

                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <Box sx={{ backgroundColor: getBackgroundColor(item.eixo), p: 1, textAlign: 'center' }}>
                                <Typography variant="body1">{item.temas}</Typography>
                            </Box>
                            <Box sx={{ backgroundColor: getBackgroundColor(item.eixo), p: 1, textAlign: 'center' }}>
                                <Typography variant="body1">{item.eixo}</Typography>
                            </Box>
                            <Box sx={{ backgroundColor: 'lightgray', p: 1, textAlign: 'center' }}>
                                <Typography variant="body1">{item.informacoes}</Typography>
                            </Box>
                        </React.Fragment>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1">Carregando informações ou nenhuma informação disponível.</Typography>
            )}
        </Container>
    );
};

export default ABNTContent;
