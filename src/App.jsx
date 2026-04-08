import { useState, useEffect, useRef } from 'react';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import appLogo from './assets/logo.png';
import './App.css';

const defaultData = {
  personalInfo: {
    fullName: 'Juan Pérez',
    jobTitle: 'Analista Financiero Senior',
    email: 'juan.perez@email.com',
    phone: '+34 600 000 000',
    location: 'Madrid, España',
    summary: 'Profesional orientado a resultados con más de 8 años de experiencia en modelado financiero, evaluación de riesgos y planificación estratégica corporativa. Historial comprobado en la optimización de procesos y mejora de la rentabilidad.',
    profileImage: ''
  },
  experience: [
    {
      id: '1',
      company: 'Corporación Financiera Global',
      position: 'Analista Financiero Senior',
      startDate: '2019-03',
      endDate: '',
      current: true,
      description: 'Lideré el equipo de análisis de inversiones. Implementé un nuevo modelo de proyección de ingresos que incrementó la precisión de los pronósticos en un 15%.'
    },
    {
      id: '2',
      company: 'Banco Nacional',
      position: 'Analista de Riesgos',
      startDate: '2015-06',
      endDate: '2019-02',
      current: false,
      description: 'Evaluación y mitigación de riesgos crediticios para grandes cuentas corporativas. Reducción de cartera vencida en un 5%.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Universidad Complutense de Madrid',
      degree: 'Máster en Finanzas Corporativas',
      startDate: '2013-09',
      endDate: '2015-06'
    },
    {
      id: '2',
      institution: 'Universidad de Barcelona',
      degree: 'Grado en Economía',
      startDate: '2009-09',
      endDate: '2013-06'
    }
  ],
  skills: ['Modelado Financiero', 'Evaluación de Riesgos', 'Excel Avanzado / VBA', 'Bloomberg Terminal', 'Planificación Estratégica', 'Liderazgo de Equipos'],
  themeColor: '#334155',
  templateId: 'corporative',
  language: 'es',
  fontFamily: 'Inter',
  fontSize: 100 // Percentage
};

function App() {
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cvBuilderData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed }; // fallback para campos nuevos
      } catch (e) {
        console.error("Error parsing local data", e);
      }
    }
    return defaultData;
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('cvBuilderData', JSON.stringify(cvData));
  }, [cvData]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv_data_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedData = JSON.parse(event.target.result);
        setCvData({ ...defaultData, ...loadedData });
      } catch (err) {
        alert("El archivo no es un JSON válido o está corrupto.");
      }
      e.target.value = null; // reset input
    };
    reader.readAsText(file);
  };

  // Calc completeness
  const calculateProgress = () => {
    let score = 0;
    const { personalInfo, experience, education, skills } = cvData;
    if (personalInfo.fullName && personalInfo.jobTitle) score += 15;
    if (personalInfo.email && personalInfo.phone) score += 10;
    if (personalInfo.profileImage) score += 15;
    if (personalInfo.summary && personalInfo.summary.length > 20) score += 20;
    if (experience.length > 0) score += 20;
    if (education.length > 0) score += 10;
    if (skills.length >= 3) score += 10;
    return Math.min(100, score);
  };

  const progress = calculateProgress();

  return (
    <div className="app-container">
      <div className="sidebar no-print">
        <div className="sidebar-header" style={{ flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={appLogo} alt="CV Builder Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <h1>CV Builder V2</h1>
            </div>
            <button className="btn-export" onClick={handlePrint}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              PDF
            </button>
          </div>
          
          <div className="progress-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completitud de tu CV</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: progress === 100 ? '#10b981' : 'var(--accent-earth)' }}>{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10b981' : 'var(--accent-earth)' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleExportJSON} style={{ flex: 1 }}>
              Guardar JSON
            </button>
            <button className="btn-secondary" onClick={handleLoadClick} style={{ flex: 1 }}>
              Cargar JSON
            </button>
            <input type="file" accept=".json" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
          </div>
        </div>
        <div className="sidebar-content">
          <CVForm cvData={cvData} setCvData={setCvData} />
        </div>
      </div>
      <div className="preview-container">
        <CVPreview cvData={cvData} />
      </div>
    </div>
  );
}

export default App;
