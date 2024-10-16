// esg-frontend/src/components/ABNTContent.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Grid } from '@mui/material';
import { getABNTInfo } from '../services/Api';

const ABNTContent = () => {
    const [data, setData] = useState([]);  // Armazena os dados da ABNT
    const navigate = useNavigate();

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

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                ABNT PR 2030 - Informações
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mb: 2 }}>
                Voltar ao Início
            </Button>
            {data.length > 0 ? (
                <Grid container spacing={2}>
                    <Grid item xs={4}><Typography variant="h6">Temas</Typography></Grid>
                    <Grid item xs={4}><Typography variant="h6">Eixo</Typography></Grid>
                    <Grid item xs={4}><Typography variant="h6">Informações</Typography></Grid>

                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={4}><Typography variant="body1">{item.temas}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1">{item.eixo}</Typography></Grid>
                            <Grid item xs={4}><Typography variant="body1">{item.informacoes}</Typography></Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">Carregando informações ou nenhuma informação disponível.</Typography>
            )}
        </Container>
    );
};

export default ABNTContent;
