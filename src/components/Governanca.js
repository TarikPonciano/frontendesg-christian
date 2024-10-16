// esg-frontend/src/components/Governanca.js

import React, { useState, useEffect, useCallback } from 'react';
import { obterDadosGovernanca, obterPerguntasGenerais, salvarDadosGovernanca, atualizarDadosGovernanca, deletarDadosGovernanca } from '../services/Api';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem } from '@mui/material';

const Governanca = () => {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(false);
  const [dadosSalvos, setDadosSalvos] = useState(true);

  const usuario = JSON.parse(localStorage.getItem('user'));

  const carregarDadosIniciais = useCallback(async () => {
    try {
      const dadosGovernanca = await obterDadosGovernanca(usuario.empresa_id);
      if (dadosGovernanca && dadosGovernanca.length > 0) {
        setDados(dadosGovernanca.map(item => ({ ...item, id: String(item.id) })));
        setEditando(false);
        setDadosSalvos(true);
      } else {
        console.log('Nenhum dado encontrado para carregar inicialmente.');
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    }
  }, [usuario.empresa_id]);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  const adicionarNovosDados = async () => {
    const perguntasGenerais = await obterPerguntasGenerais();
    const novosDados = perguntasGenerais.map(pg => ({
      ...pg,
      id: `geral-${pg.id}`,
      avaliacao: '',
      oquefazer: '',
      empresa_id: usuario.empresa_id
    }));
    setDados(novosDados);
    setEditando(true);
    setDadosSalvos(false);
  };

  const manipularMudancaDeInput = (id, campo, valor) => {
    const novosDados = dados.map(item => item.id === id ? { ...item, [campo]: valor } : item);
    setDados(novosDados);
  };

  const salvarDados = async () => {
    if (!window.confirm('Você realmente deseja salvar todas as alterações?')) return;
    try {
      await Promise.all(dados.map(item => item.id.startsWith('geral-')
        ? salvarDadosGovernanca({ ...item, id: undefined })
        : atualizarDadosGovernanca(item.id, item)));
      alert('Todas as alterações foram salvas com sucesso!');
      carregarDadosIniciais();
    } catch (erro) {
      console.error('Erro ao salvar dados:', erro);
    }
  };

  const deletarTodosDados = async () => {
    if (!window.confirm('Você realmente deseja deletar TODOS os dados? Esta ação não pode ser desfeita.')) return;
    try {
      await deletarDadosGovernanca(usuario.empresa_id);
      alert('Todos os dados foram deletados com sucesso!');
      setDados([]);
      setDadosSalvos(true);
      setEditando(false);
    } catch (erro) {
      console.error('Erro ao deletar todos os dados:', erro);
    }
  };

  // Função para agrupar os dados por categoria
  const agruparPorCategoria = (dados) => {
    return dados.reduce((agrupado, item) => {
      const categoria = item.categoria || 'Sem Categoria';
      if (!agrupado[categoria]) {
        agrupado[categoria] = [];
      }
      agrupado[categoria].push(item);
      return agrupado;
    }, {});
  };

  const dadosAgrupados = agruparPorCategoria(dados);

  return (
    <div>
      <h1>Governança</h1>
      {dadosSalvos && (
        <>
          <Button variant="contained" color="primary" onClick={adicionarNovosDados} style={{ marginBottom: '20px' }} disabled={dados.length > 0}>
            Adicionar Novo
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setEditando(!editando)} style={{ marginBottom: '20px' }}>
            {editando ? 'Cancelar Edição' : 'Editar Dados'}
          </Button>
          <Button variant="contained" color="error" onClick={deletarTodosDados} style={{ marginBottom: '20px' }}>
            Deletar Todos os Dados
          </Button>
        </>
      )}
      {editando && (
        <Button variant="contained" color="primary" onClick={salvarDados} style={{ marginBottom: '20px' }}>
          Salvar Todas as Alterações
        </Button>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Categoria</TableCell>
            <TableCell>Pergunta</TableCell>
            <TableCell>Avaliação</TableCell>
            <TableCell>O que Fazer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(dadosAgrupados).map(([categoria, itens]) => (
            <React.Fragment key={categoria}>
              <TableRow>
                <TableCell colSpan={4} style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  {categoria}
                </TableCell>
              </TableRow>
              {itens.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.pergunta}</TableCell>
                  <TableCell>
                    <Select
                      value={item.avaliacao || ''}
                      onChange={(e) => manipularMudancaDeInput(item.id, 'avaliacao', e.target.value)}
                      disabled={!editando}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="Sim">Sim</MenuItem>
                      <MenuItem value="Não">Não</MenuItem>
                      <MenuItem value="Não se Aplica">Não se Aplica</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item.oquefazer || ''}
                      onChange={(e) => manipularMudancaDeInput(item.id, 'oquefazer', e.target.value)}
                      disabled={!editando}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Governanca;
