// esg-frontend/src/components/AnaliseESG.js

import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getEnvironmentalData, getSocialData, getGovernanceData } from '../services/Api';

const AnaliseESG = () => {
  const [data, setData] = useState({
    environment: {},
    social: {},
    governance: {}
  });
  const [generalAverage, setGeneralAverage] = useState(null);
  const [individualAverages, setIndividualAverages] = useState([]);
  const [allCategories, setAllCategories] = useState({
    environment: [],
    social: [],
    governance: []
  });
  const [visibleCategories, setVisibleCategories] = useState({
    environment: [],
    social: [],
    governance: []
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleToggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const categoryLabels = {
    environment: 'Meio Ambiente (E)',
    social: 'Social (S)',
    governance: 'Governança (G)'
  };

  const categoryOrder = {
    environment: ['Resíduos', 'Energia', 'Água', 'Natureza', 'Pegada de Carbono'],
    social: ['Trabalho', 'Clientes', 'Equipe', 'Comunidade', 'Segurança e Qualidade'],
    governance: ['Finanças', 'Ética', 'Diretoria', 'Conduta', 'Relacionamento com o Governo']
  };

  const calculateAverage = (groups) => {
    const values = Object.values(groups);
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const calculateAverages = useCallback((environmentGroups, socialGroups, governanceGroups) => {
    const envAverage = calculateAverage(environmentGroups);
    const socAverage = calculateAverage(socialGroups);
    const govAverage = calculateAverage(governanceGroups);

    const totalAverage = (envAverage + socAverage + govAverage) / 3;
    setGeneralAverage(totalAverage.toFixed(0));
    setIndividualAverages([envAverage, socAverage, govAverage]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const environment = await getEnvironmentalData();
        const social = await getSocialData();
        const governance = await getGovernanceData();

        const environmentGroups = groupByCategory(environment);
        const socialGroups = groupByCategory(social);
        const governanceGroups = groupByCategory(governance);

        setData({
          environment: environmentGroups,
          social: socialGroups,
          governance: governanceGroups
        });

        setAllCategories({
          environment: Object.keys(environmentGroups),
          social: Object.keys(socialGroups),
          governance: Object.keys(governanceGroups)
        });

        setVisibleCategories({
          environment: Object.keys(environmentGroups),
          social: Object.keys(socialGroups),
          governance: Object.keys(governanceGroups)
        });

        calculateAverages(environmentGroups, socialGroups, governanceGroups);
      } catch ( error) {
        console.error('Erro ao carregar dados ESG:', error);
      }
    };

    fetchData();
  }, [calculateAverages]);

  const groupByCategory = (data) => {
    return data.reduce((acc, item) => {
      acc[item.categoria] = item.porcentagem_sim;
      return acc;
    }, {});
  };

  const toggleCategory = (category, subCategory) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: prev[category].includes(subCategory)
        ? prev[category].filter(sc => sc !== subCategory)
        : [...prev[category], subCategory]
    }));
  };

  const createChartData = (category) => {
    const categoryColors = {
      environment: 'rgba(75, 192, 192, 0.6)',
      social: 'rgba(54, 162, 235, 0.6)',
      governance: 'rgba(255, 99, 132, 0.6)'
    };

    const borderColor = {
      environment: 'rgba(75, 192, 192, 1)',
      social: 'rgba(54, 162, 235, 1)',
      governance: 'rgba(255, 99, 132, 1)'
    };

    const filteredData = categoryOrder[category]
      .filter(cat => visibleCategories[category].includes(cat))
      .reduce((acc, cat) => {
        if (data[category][cat] !== undefined) {
          acc[cat] = data[category][cat];
        }
        return acc;
      }, {});

    const datasetData = Object.values(filteredData);
    const backgroundColors = datasetData.map(() => categoryColors[category]);
    const borderColors = datasetData.map(() => borderColor[category]);

    const average = datasetData.length > 0
      ? (datasetData.reduce((a, b) => a + b, 0) / datasetData.length).toFixed(2)
      : 0;

    return {
      labels: Object.keys(filteredData),
      datasets: [
        {
          label: `Média: ${average}%`,
          data: datasetData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }
      ]
    };
  };

  //Gráficos
  const createGeneralChartData = () => {
    return {
      labels: ['Meio Ambiente', 'Social', 'Governança'],
      datasets: [
        {
          label: '',
          data: individualAverages,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2,
          hidden: false
        }
      ]
    };
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      },
      x: {
        ticks: {
          font: {
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" // Certifique-se de que a fonte suporta UTF-8
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw.toFixed(2)}%`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h1>Análise ESG</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20px',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'gray'
        }}
      >
        Diagnóstico Geral: {generalAverage}%
      </div>
      <button onClick={handleToggleFilters} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <FilterListIcon style={{ color: 'gray', fontSize: '30px' }} />
      </button>
      {filtersVisible && Object.keys(allCategories).map((category, index) => (
        <div key={index} style={{ marginBottom: '50px' }}>
          <h2>{categoryLabels[category]}</h2>
          {allCategories[category].map((subCat) => (
            <label key={subCat}>
              <input
                type="checkbox"
                checked={visibleCategories[category].includes(subCat)}
                onChange={() => toggleCategory(category, subCat)}
              />
              {subCat}
            </label>
          ))}
          <Bar data={createChartData(category)} options={chartOptions} />
        </div>
      ))}
      <Bar data={createGeneralChartData()} options={chartOptions} />
    </div>
  );
};

export default AnaliseESG;
