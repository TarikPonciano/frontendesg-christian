// esg-frontend/src/services/Api.js

// Função de login
export const login = async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json; charset=utf-8', 
            'Accept-Charset': 'utf-8',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token && data.name && data.role && data.empresa_name) {
        localStorage.setItem('token', data.token); // Armazena o token no localStorage
        localStorage.setItem('user', JSON.stringify({
            name: data.name,
            role: data.role,
            empresa_id: data.empresa_id,
            empresa_name: data.empresa_name // Armazena também o nome da empresa
        }));
    } else {
        console.error('Login failed:', data.message);
        throw new Error(data.message || "Authentication failed.");
    }
    return data;
};

// Função para obter indicadores ESG
export const getIndicators = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/indicator`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar indicadores: ${response.statusText}`);
    }
    return await response.json();
  };

// Função para enviar novos indicadores ESG (se necessário)
export const saveIndicators = async (indicadores) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/indicator`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indicadores)
    });
    const data = await response.json();
    return data;
  };

// Função para atualizar um indicador ESG existente
export const updateIndicador = async (id, indicador) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/indicator/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indicador)
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar indicador: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  };

// Função para excluir um indicador ESG
export const deleteIndicador = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/indicator/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao excluir indicador: ${response.statusText}`);
    }
    return response.status === 204;
  };

// Função para obter um indicador ESG específico
export const getIndicador = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/indicator/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar indicador: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

// Função para enviar novas metas ESG
export const saveMetas = async (metas) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meta`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(metas)
    });
    const data = await response.json();
    return data;
};

// Função para atualizar uma meta ESG existente
export const editMeta = async (meta) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meta/${meta.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(meta)
    });
    if (!response.ok) {
        throw new Error(`Erro ao atualizar meta: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

// Função para excluir uma meta ESG
export const deleteMeta = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meta/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao excluir meta: ${response.statusText}`);
    }
    return response.json();  // Retorna o JSON de confirmação ou erro
};

// Função para obter resultados ESG
export const getResultados = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/resultados`, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Inclui o token de autenticação
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar resultados: ${response.status}`);
    }
    return await response.json();
};

// Função para enviar novos resultados ESG
export const saveResultados = async (resultados) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/resultados`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Inclui o token de autenticação
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(resultados)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao adicionar resultado: ${response.status} ${errorData.msg}`);
    }
    return await response.json();
};

// Função para atualizar um resultado ESG existente
export const editResultado = async (resultado) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/resultados/${resultado.id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,  // Inclui o token de autenticação
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(resultado),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao atualizar resultado: ${response.status} ${errorData.msg}`);
    }
    return await response.json();
};

// Função para excluir um resultado ESG
export const deleteResultado = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/resultados/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,  // Inclui o token de autenticação
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao excluir resultado: ${response.statusText}`);
    }
    return response.status === 204; // Retorna true se a exclusão for bem-sucedida
};

// Função para obter informações ABNT PR 2030
export const getABNTInfo = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/abntpr2030`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const data = await response.json();
    return data;
  };

// Função para obter planejamento
export const getPlanejamento = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/planejamento`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    const data = await response.json();
    return data;
};

// Função para salvar novo planejamento
export const savePlanejamento = async (planejamento) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/planejamento`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(planejamento)
    });
    const data = await response.json();
    return data;
};

// Função para atualizar um planejamento existente
export const updatePlanejamento = async (id, planejamento) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/planejamento/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(planejamento),
    });

    if (!response.ok) {
        throw new Error('Erro ao atualizar planejamento: ' + response.statusText);
    }
    const data = await response.json();
    return data;
};

// Função para excluir um planejamento
export const deletePlanejamento = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/planejamento/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Erro ao excluir planejamento: ' + response.statusText);
    }
    return response.status === 204;
};

// Função exibir relatório geral
export const getRelatorioGeral = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/relatoriogeral`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar relatório geral: ${response.statusText}`);
    }
    return await response.json();
  };

  // Função exibir relatório por eixo
export const getPorEixo = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/relatoriogeral/qtdporeixo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar relatório geral: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter relatório ESG
export const getRelatorioESG = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/relatorioesg`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar relatório ESG: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter relatório Planejamento
export const getRelatorioPlanejamento = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/relatorioplanejamento`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar relatório de planejamento: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter os dados gerais do dashboard
export const getGeneralDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/general`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados gerais do dashboard: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Falha ao obter dados gerais do dashboard:', error);
        throw error;
    }
};


// Função para obter dados mensais do dashboard
export const getRelatorioMensal = async () => {
    const token = localStorage.getItem('token'); // Recupera o token armazenado no localStorage
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/mensal`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token de autenticação
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados mensais do dashboard: ${response.statusText}`);
        }
        return await response.json(); // Retorna os dados obtidos
    } catch (error) {
        console.error('Falha ao obter dados mensais do dashboard:', error);
        throw error;
    }
};

//Criar dados ambientais
export const criarDadosAmbientais = async (data) => {
    const token = localStorage.getItem('token');
    let url = `${process.env.REACT_APP_API_URL}/meioambiente`;
    let method = 'POST';

    if (data.id) {
        url += `/${data.id}`;
        method = 'PUT';
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao salvar/atualizar dados ambientais:", errorText);
        throw new Error(`Erro ao salvar/atualizar dados ambientais: ${response.statusText}`);
    }
    return await response.json();
};

// Função para salvar ou atualizar dados ambientais
export const salvarDadosAmbientais = async (data) => {
    const token = localStorage.getItem('token');
    let url = `${process.env.REACT_APP_API_URL}/meioambiente`;
    let method = 'POST';
    // Se tiver ID, altera a URL para fazer PUT (atualizar)
    if (data.id) {
        url += `/${data.id}`;
        method = 'PUT';
    }
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao salvar/atualizar dados ambientais:", errorText);
        throw new Error(`Erro ao salvar/atualizar dados ambientais: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter dados ambientais
export const obterDadosAmbientais = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meioambiente`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados ambientais: ${response.statusText}`);
    }
    return await response.json();
};

// Função para atualizar dados ambientais
export const atualizarDadosAmbientais = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meioambiente/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`Erro ao atualizar dados ambientais: ${response.statusText}`);
    }
    return await response.json();
};



// Função para obter categoria e pergunta de meio ambiente
export const obterPerguntasMeioAmbiente = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meioambiente/general`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar perguntas gerais de meio ambiente: ${response.statusText}`);
    }
    return await response.json();
};

// Função para deletar dados ambientais
export const deletarDadosAmbientais = async (empresaId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/meioambiente/all/${empresaId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        const errorText = await response.json();  // Assegure-se de que a resposta é JSON
        console.error("Erro ao deletar todos os dados ambientais:", errorText.message);
        throw new Error(`Erro ao deletar todos os dados ambientais: ${errorText.message}`);
    }
    return await response.json();
};

// Função para obter dados sociais
export const obterDadosSocial = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/social`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });

    if (!response.ok) {
        throw new Error(`Erro ao buscar dados social: ${response.statusText}`);
    }

    return await response.json();
};

// Função para obter categoria e pergunta social
export const obterPerguntasGeneraisSocial = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/social/general`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  
    if (!response.ok) {
      throw new Error(`Erro ao buscar perguntas gerais: ${response.statusText}`);
    }
  
    return await response.json();
  };

// Função para atualizar dados social
export const atualizarDadosSocial = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/social/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({...data, empresa_id: JSON.parse(localStorage.getItem('user')).empresa_id}),
    });

    if (!response.ok) {
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const errorDetails = await response.json();
        console.error("Erro ao atualizar dados social:", errorDetails);
        throw new Error(`Erro ao atualizar dados social: ${response.statusText}`);
      } else {
        const errorText = await response.text();
        console.error("Erro ao atualizar dados social:", errorText);
        throw new Error(`Erro ao atualizar dados social: ${response.statusText}`);
      }
    }
    return await response.json();
};

  // Função para salvar novos dados social
export const salvarDadosSocial = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/social`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao salvar dados social:", errorText);
        throw new Error(`Erro ao salvar dados social: ${response.statusText}`);
    }

    return await response.json();
};

// Função para deletar dados social
export const deletarDadosSocial = async (empresaId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/social/all/${empresaId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        const errorText = await response.json();  // Assegure-se de que a resposta é JSON
        console.error("Erro ao deletar todos os dados social:", errorText.message);
        throw new Error(`Erro ao deletar todos os dados social: ${errorText.message}`);
    }
    return await response.json();
};

// Função para obter dados ambientais
export const getEnvironmentalData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/analiseesg/meio-ambiente`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados ambientais: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter dados sociais
export const getSocialData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/analiseesg/social`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados sociais: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter dados de governança
export const obterDadosGovernanca = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/governanca`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados de governança: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter categoria e pergunta de governanca
export const obterPerguntasGenerais = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/governanca/general`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar perguntas gerais: ${response.statusText}`);
    }
    return await response.json();
  };

// Função para atualizar dados de governança
export const atualizarDadosGovernanca = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/governanca/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({...data, empresa_id: JSON.parse(localStorage.getItem('user')).empresa_id}),
    });
    if (!response.ok) {
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const errorDetails = await response.json();
        console.error("Erro ao atualizar dados de governança:", errorDetails);
        throw new Error(`Erro ao atualizar dados de governança: ${response.statusText}`);
      } else {
        const errorText = await response.text();
        console.error("Erro ao atualizar dados de governança:", errorText);
        throw new Error(`Erro ao atualizar dados de governança: ${response.statusText}`);
      }
    }
    return await response.json();
};

  // Função para salvar novos dados de governança
export const salvarDadosGovernanca = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/governanca`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao salvar dados de governança:", errorText);
        throw new Error(`Erro ao salvar dados de governança: ${response.statusText}`);
    }
    return await response.json();
};

// Função para deletar dados de governança
export const deletarDadosGovernanca = async (empresaId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/governanca/all/${empresaId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        const errorText = await response.json();  // Assegure-se de que a resposta é JSON
        console.error("Erro ao deletar todos os dados de governança:", errorText.message);
        throw new Error(`Erro ao deletar todos os dados de governança: ${errorText.message}`);
    }
    return await response.json();
};

// Função para obter dados de governança
export const getGovernanceData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/analiseesg/governanca`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados de governança: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter todos os RoadMaps
export const getRoadMaps = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/roadmap`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar RoadMaps: ${response.statusText}`);
    }
    return await response.json();
};

// Função para salvar um novo RoadMap
export const saveRoadMap = async (roadMap) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/roadmap`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(roadMap)
    });
    if (!response.ok) {
        throw new Error(`Erro ao salvar RoadMap: ${response.statusText}`);
    }
    return await response.json();
};

// Função para atualizar um RoadMap existente
export const updateRoadMap = async (id, roadMap) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/roadmap/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(roadMap)
    });
    if (!response.ok) {
        throw new Error(`Erro ao atualizar RoadMap: ${response.statusText}`);
    }
    return await response.json();
};

// Função para deletar um RoadMap
export const deleteRoadMap = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/roadmap/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        }
    });
    if (!response.ok) {
        throw new Error(`Erro ao deletar RoadMap: ${response.statusText}`);
    }
    return response.status === 204;
};

//Buscar relatório de ações
export const getRelatorioAcoes = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/relatorioacoes`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar relatório de ações: ${response.statusText}`);
    }
    return await response.json();
};

// Função para registrar uma empresa e usuário
export const registerCompanyAndUser = async (email, password, role, name, empresa_name) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/criarempresa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ email, password, role, name, empresa_name }),  // empresa_name deve corresponder ao campo esperado pelo backend
    });
    if (!response.ok) {
        const errorData = await response.text();
        console.error('Falha ao registrar:', errorData);
        throw new Error(`Falha ao registrar. Detalhes: ${errorData}`);
    }
    return await response.json();
};

// Função para obter todas as empresas
export const getEmpresas = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/criarempresa/empresas`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar empresas: ${response.statusText}`);
    }
    return await response.json();
};

// Função para obter todos os usuários
export const getUsuarios = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/criarempresa/usuarios`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
    }
    return await response.json();
};

// Função na API para atualizar permissões da empresa
export const updatePermissoesEmpresa = async (empresaId, permissoes) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/criarempresa/empresas/${empresaId}/permissoes`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ permissoes })
    });
    if (!response.ok) {
        throw new Error(`Erro ao atualizar permissões da empresa: ${response.statusText}`);
    }
    return await response.json();
};
