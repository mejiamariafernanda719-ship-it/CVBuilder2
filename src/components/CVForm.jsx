import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExperienceItem = ({ exp, updateExperience, removeExperience }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exp.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="item-card">
      <div className="item-header-actions">
        <button className="btn-drag" {...attributes} {...listeners} title="Arrastrar para reordenar">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
        </button>
        <button className="btn-remove" onClick={() => removeExperience(exp.id)} title="Eliminar experiencia">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>

      <div className="form-group">
        <label>Empresa</label>
        <input type="text" className="form-control" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Puesto</label>
        <input type="text" className="form-control" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label>Fecha Inicio</label>
          <input type="month" className="form-control" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha Fin</label>
          <input type="month" className="form-control" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} />
        </div>
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} />
        <label htmlFor={`current-${exp.id}`} style={{ margin: 0 }}>Trabajo actualmente aquí</label>
      </div>
      <div className="form-group">
        <label>Descripción y Logros</label>
        <textarea className="form-control" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} />
      </div>
    </div>
  );
};

const SortableEducationItem = ({ edu, updateEducation, removeEducation }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: edu.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="item-card">
      <div className="item-header-actions">
        <button className="btn-drag" {...attributes} {...listeners} title="Arrastrar para reordenar">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
        </button>
        <button className="btn-remove" onClick={() => removeEducation(edu.id)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>

      <div className="form-group">
        <label>Institución</label>
        <input type="text" className="form-control" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Título / Grado</label>
        <input type="text" className="form-control" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label>Fecha Inicio</label>
          <input type="month" className="form-control" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha Fin</label>
          <input type="month" className="form-control" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default function CVForm({ cvData, setCvData }) {
  const [newSkill, setNewSkill] = useState('');

  const PRESET_COLORS = [
    '#334155', // Slate
    '#0f172a', // Dark Blue
    '#273c2c', // Olive
    '#4b3e34', // Brown/Earth
    '#5b21b6', // Purple
  ];

  const updatePersonalInfo = (e) => {
    const { name, value } = e.target;
    setCvData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, [name]: value }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvData({
          ...cvData,
          personalInfo: { ...cvData.personalInfo, profileImage: reader.result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCvData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, profileImage: '' }
    });
  };

  // --- EXPERIENCE ---
  const updateExperience = (id, field, value) => {
    const updated = cvData.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    setCvData({ ...cvData, experience: updated });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCvData({ ...cvData, experience: [...cvData.experience, newExp] });
  };

  const removeExperience = (id) => {
    setCvData({ ...cvData, experience: cvData.experience.filter(exp => exp.id !== id) });
  };

  const handleDragEndExperience = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.experience.findIndex(item => item.id === active.id);
      const newIndex = cvData.experience.findIndex(item => item.id === over.id);
      
      const newExp = [...cvData.experience];
      const [movedItem] = newExp.splice(oldIndex, 1);
      newExp.splice(newIndex, 0, movedItem);

      setCvData({ ...cvData, experience: newExp });
    }
  };

  // --- EDUCATION ---
  const updateEducation = (id, field, value) => {
    const updated = cvData.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
    setCvData({ ...cvData, education: updated });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
    };
    setCvData({ ...cvData, education: [...cvData.education, newEdu] });
  };

  const removeEducation = (id) => {
    setCvData({ ...cvData, education: cvData.education.filter(edu => edu.id !== id) });
  };

  const handleDragEndEducation = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.education.findIndex(item => item.id === active.id);
      const newIndex = cvData.education.findIndex(item => item.id === over.id);
      
      const newEdu = [...cvData.education];
      const [movedItem] = newEdu.splice(oldIndex, 1);
      newEdu.splice(newIndex, 0, movedItem);

      setCvData({ ...cvData, education: newEdu });
    }
  };


  // --- SKILLS ---
  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setCvData({ ...cvData, skills: cvData.skills.filter(skill => skill !== skillToRemove) });
  };


  return (
    <div className="cv-form">
      {/* ---- APARIENCIA Y PLANTILLAS ---- */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
          Apariencia General
        </h2>
        
        <div className="form-group">
          <label>Plantilla (Template)</label>
          <select className="form-control" value={cvData.templateId || 'corporative'} onChange={e => setCvData({ ...cvData, templateId: e.target.value })}>
            <option value="corporative">Corporativo Clásico</option>
            <option value="modern">Moderno Lateral</option>
            <option value="minimalist">Minimalista (Centrado)</option>
            <option value="executive">Ejecutivo (Compacto tradicional)</option>
            <option value="creative">Creativo (Cabecera ancha)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Idioma del CV</label>
            <select className="form-control" value={cvData.language || 'es'} onChange={e => setCvData({ ...cvData, language: e.target.value })}>
              <option value="es">Español</option>
              <option value="en">Inglés (English)</option>
              <option value="fr">Francés (Français)</option>
              <option value="it">Italiano (Italiano)</option>
              <option value="de">Alemán (Deutsch)</option>
              <option value="pt">Portugués (Português)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tipografía</label>
            <select className="form-control" value={cvData.fontFamily || 'Inter'} onChange={e => setCvData({ ...cvData, fontFamily: e.target.value })}>
              <option value="Inter">Inter (Sans formal)</option>
              <option value="Outfit">Outfit (Moderna redondeada)</option>
              <option value="Merriweather">Merriweather (Serif clásica)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tamaño Global del Texto</span>
            <span>{cvData.fontSize || 100}%</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCvData({ ...cvData, fontSize: Math.max(70, (cvData.fontSize || 100) - 5) })}>
              A-
            </button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCvData({ ...cvData, fontSize: Math.min(130, (cvData.fontSize || 100) + 5) })}>
              A+
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Color de Acento</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            {PRESET_COLORS.map(color => (
              <button 
                key={color} 
                title={color}
                className={`color-preset ${cvData.themeColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setCvData({ ...cvData, themeColor: color })}
              />
            ))}
            <input 
              type="color" 
              value={cvData.themeColor} 
              onChange={(e) => setCvData({ ...cvData, themeColor: e.target.value })} 
              style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer' }}
              title="Color personalizado"
            />
          </div>
        </div>
      </div>

      {/* ---- DATOS PERSONALES ---- */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Datos Personales
        </h2>
        
        <div className="form-group">
          <label>Foto de Perfil</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {cvData.personalInfo.profileImage && (
              <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                <img src={cvData.personalInfo.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--border-color)'}} />
                <button onClick={removeImage} className="btn-remove" style={{ position: 'absolute', top: '-5px', right: '-15px', background: 'var(--bg-dark)'}}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" style={{ flex: 1, padding: '6px' }} />
          </div>
        </div>

        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" name="fullName" className="form-control" value={cvData.personalInfo.fullName} onChange={updatePersonalInfo} placeholder="Ej. Juan Pérez" />
        </div>
        <div className="form-group">
          <label>Título Profesional</label>
          <input type="text" name="jobTitle" className="form-control" value={cvData.personalInfo.jobTitle} onChange={updatePersonalInfo} placeholder="Ej. Analista de Datos" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={cvData.personalInfo.email} onChange={updatePersonalInfo} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" name="phone" className="form-control" value={cvData.personalInfo.phone} onChange={updatePersonalInfo} />
          </div>
        </div>
        <div className="form-group">
          <label>Ubicación</label>
          <input type="text" name="location" className="form-control" value={cvData.personalInfo.location} onChange={updatePersonalInfo} />
        </div>
        <div className="form-group">
          <label>Perfil Profesional</label>
          <textarea name="summary" className="form-control" value={cvData.personalInfo.summary} onChange={updatePersonalInfo} placeholder="Un breve resumen de tu perfil..." />
        </div>
      </div>

      {/* ---- EXPERIENCIA ---- */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          Experiencia Laboral
        </h2>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndExperience}>
          <SortableContext items={cvData.experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {cvData.experience.map((exp) => (
              <SortableExperienceItem key={exp.id} exp={exp} updateExperience={updateExperience} removeExperience={removeExperience} />
            ))}
          </SortableContext>
        </DndContext>

        <button className="btn-add" onClick={addExperience}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Añadir Experiencia
        </button>
      </div>

      {/* ---- EDUCACIÓN ---- */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
          Educación
        </h2>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndEducation}>
          <SortableContext items={cvData.education.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {cvData.education.map((edu) => (
              <SortableEducationItem key={edu.id} edu={edu} updateEducation={updateEducation} removeEducation={removeEducation} />
            ))}
          </SortableContext>
        </DndContext>

        <button className="btn-add" onClick={addEducation}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Añadir Educación
        </button>
      </div>

      {/* ---- HABILIDADES ---- */}
      <div className="form-section">
        <h2>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Habilidades Principales
        </h2>
        <form onSubmit={addSkill} className="skills-input-container">
          <input type="text" className="form-control" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Añadir habilidad..." />
          <button type="submit" className="btn-export" style={{ padding: '10px' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </form>
        <div className="skills-list">
          {cvData.skills.map((skill, idx) => (
            <div key={idx} className="skill-tag">
              {skill}
              <button onClick={() => removeSkill(skill)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
