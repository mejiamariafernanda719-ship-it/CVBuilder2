import './CVPreview.css';

const DICTIONARY = {
  es: {
    profile: 'Perfil',
    workExp: 'Experiencia Profesional',
    education: 'Formación Académica',
    skills: 'Habilidades',
    present: 'Actualidad'
  },
  en: {
    profile: 'Profile',
    workExp: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    present: 'Present'
  },
  fr: {
    profile: 'Profil',
    workExp: 'Expérience Professionnelle',
    education: 'Éducation',
    skills: 'Compétences',
    present: 'Présent'
  },
  it: {
    profile: 'Profilo',
    workExp: 'Esperienza Lavorativa',
    education: 'Istruzione',
    skills: 'Competenze',
    present: 'Presente'
  },
  de: {
    profile: 'Profil',
    workExp: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Fähigkeiten',
    present: 'Heute'
  },
  pt: {
    profile: 'Perfil',
    workExp: 'Experiência Profissional',
    education: 'Educação',
    skills: 'Habilidades',
    present: 'Atual'
  }
};

export default function CVPreview({ cvData }) {
  const { personalInfo, experience, education, skills, themeColor, templateId, language, fontFamily, fontSize } = cvData;
  const lang = DICTIONARY[language] || DICTIONARY['es'];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(language, { month: 'short', year: 'numeric' });
  };

  const cssVariables = {
    '--cv-accent': themeColor || '#334155',
    'fontFamily': `'${fontFamily}', sans-serif`,
    'fontSize': `${fontSize}%`
  };

  // --- COMMON SECTIONS RENDERERS TO AVOID DUPLICATION ---
  const renderContact = (separator = '•') => (
    <>
      {personalInfo.email && <span className="contact-item">{personalInfo.email}</span>}
      {personalInfo.email && personalInfo.phone && <span className="separator">{separator}</span>}
      {personalInfo.phone && <span className="contact-item">{personalInfo.phone}</span>}
      {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span className="separator">{separator}</span>}
      {personalInfo.location && <span className="contact-item">{personalInfo.location}</span>}
    </>
  );

  const renderExperienceList = () => (
    <div className="timeline">
      {experience.map((exp) => (
        <div key={exp.id} className="timeline-item">
          <div className="timeline-header">
            <h4 className="item-title">{exp.position}{exp.position && exp.company && ' | '}{exp.company}</h4>
            <span className="item-date">
              {formatDate(exp.startDate)} - {exp.current ? lang.present : formatDate(exp.endDate)}
            </span>
          </div>
          {exp.description && <p className="item-desc">{exp.description}</p>}
        </div>
      ))}
    </div>
  );

  const renderEducationList = () => (
    <div className="timeline">
      {education.map((edu) => (
        <div key={edu.id} className="timeline-item">
          <div className="timeline-header">
            <h4 className="item-title">{edu.degree}</h4>
            <span className="item-date">
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
            </span>
          </div>
          <div className="item-subtitle">{edu.institution}</div>
        </div>
      ))}
    </div>
  );

  const renderSkillsGrid = (itemClass) => (
    <div className="skills-grid">
      {skills.map((skill, idx) => (
        <span key={idx} className={itemClass}>{skill}</span>
      ))}
    </div>
  );

  const renderProfileImage = (containerClass) => {
    if (!personalInfo.profileImage) return null;
    return (
      <div className={containerClass}>
        <img src={personalInfo.profileImage} alt="Profile" className="cv-profile-img" />
      </div>
    );
  };

  // -------------------------
  // TEMPLATE: MODERN
  // -------------------------
  if (templateId === 'modern') {
    return (
      <div className="cv-paper cv-template-modern" style={cssVariables}>
        <div className="modern-sidebar">
          {renderProfileImage('modern-img-container')}
          
          <div className="modern-contact vertical-contact">
            {renderContact()}
          </div>

          {skills.length > 0 && (
            <div className="modern-skills">
              <h3 className="modern-section-title">{lang.skills}</h3>
              <div className="modern-skills-list">
                {skills.map((skill, idx) => (
                  <span key={idx} className="modern-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modern-main">
          <header className="modern-header">
            <h1 className="modern-name">{personalInfo.fullName || 'Tu Nombre'}</h1>
            <h2 className="modern-title">{personalInfo.jobTitle || 'Puesto'}</h2>
          </header>

          {personalInfo.summary && (
            <section className="cv-section">
              <h3 className="section-title">{lang.profile}</h3>
              <p className="cv-summary">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="cv-section">
              <h3 className="section-title">{lang.workExp}</h3>
              {renderExperienceList()}
            </section>
          )}

          {education.length > 0 && (
            <section className="cv-section">
              <h3 className="section-title">{lang.education}</h3>
              {renderEducationList()}
            </section>
          )}
        </div>
      </div>
    );
  }

  // -------------------------
  // TEMPLATE: MINIMALIST
  // -------------------------
  if (templateId === 'minimalist') {
    return (
      <div className="cv-paper cv-template-minimalist" style={cssVariables}>
        <header className="minimalist-header">
          {renderProfileImage('minimalist-img-container')}
          <h1 className="minimalist-name">{personalInfo.fullName || 'Tu Nombre'}</h1>
          <h2 className="minimalist-title">{personalInfo.jobTitle || 'Puesto que Aplicas'}</h2>
          <div className="minimalist-contact">
            {renderContact()}
          </div>
        </header>

        <div className="minimalist-body">
          {personalInfo.summary && (
            <section className="cv-section">
              <p className="cv-summary minimalist-summary">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="cv-section">
              <h3 className="minimalist-section-title">{lang.workExp}</h3>
              {renderExperienceList()}
            </section>
          )}

          {education.length > 0 && (
            <section className="cv-section">
              <h3 className="minimalist-section-title">{lang.education}</h3>
              {renderEducationList()}
            </section>
          )}

          {skills.length > 0 && (
            <section className="cv-section">
              <h3 className="minimalist-section-title">{lang.skills}</h3>
              {renderSkillsGrid('minimalist-skill-tag')}
            </section>
          )}
        </div>
      </div>
    );
  }

  // -------------------------
  // TEMPLATE: EXECUTIVE
  // -------------------------
  if (templateId === 'executive') {
    return (
      <div className="cv-paper cv-template-executive" style={cssVariables}>
        <header className="exec-header">
          <div className="exec-header-left">
            <h1 className="exec-name">{personalInfo.fullName || 'Tu Nombre'}</h1>
            <h2 className="exec-title">{personalInfo.jobTitle || 'Puesto que Aplicas'}</h2>
          </div>
          <div className="exec-contact">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
        </header>

        {personalInfo.summary && (
          <section className="cv-section">
            <h3 className="exec-section-title">{lang.profile}</h3>
            <p className="cv-summary">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="cv-section">
            <h3 className="exec-section-title">{lang.workExp}</h3>
            {renderExperienceList()}
          </section>
        )}

        {education.length > 0 && (
          <section className="cv-section">
            <h3 className="exec-section-title">{lang.education}</h3>
            {renderEducationList()}
          </section>
        )}

        {skills.length > 0 && (
          <section className="cv-section">
            <h3 className="exec-section-title">{lang.skills}</h3>
            {renderSkillsGrid('exec-skill-tag')}
          </section>
        )}
      </div>
    );
  }

  // -------------------------
  // TEMPLATE: CREATIVE
  // -------------------------
  if (templateId === 'creative') {
    return (
      <div className="cv-paper cv-template-creative" style={cssVariables}>
        <div className="creative-header-block">
          <div className="creative-header-content">
            {renderProfileImage('creative-img-container')}
            <div className="creative-header-text">
              <h1 className="creative-name">{personalInfo.fullName || 'Tu Nombre'}</h1>
              <h2 className="creative-title">{personalInfo.jobTitle || 'Puesto que Aplicas'}</h2>
              <div className="creative-contact">
                {renderContact()}
              </div>
            </div>
          </div>
        </div>

        <div className="creative-body">
          {personalInfo.summary && (
            <section className="cv-section">
              <h3 className="creative-section-title">{lang.profile}</h3>
              <p className="cv-summary">{personalInfo.summary}</p>
            </section>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '25px' }}>
            <div>
              {experience.length > 0 && (
                <section className="cv-section">
                  <h3 className="creative-section-title">{lang.workExp}</h3>
                  {renderExperienceList()}
                </section>
              )}
            </div>
            
            <div>
              {education.length > 0 && (
                <section className="cv-section">
                  <h3 className="creative-section-title">{lang.education}</h3>
                  {renderEducationList()}
                </section>
              )}

              {skills.length > 0 && (
                <section className="cv-section">
                  <h3 className="creative-section-title">{lang.skills}</h3>
                  {renderSkillsGrid('creative-skill-tag')}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // TEMPLATE: CORPORATIVE (Default)
  // -------------------------
  return (
    <div className="cv-paper" style={cssVariables}>
      <header className="cv-header" style={{ display: 'flex', alignItems: 'center', gap: '24px', textAlign: 'left' }}>
        {renderProfileImage('cv-profile-img-container')}
        <div style={{ flex: 1 }}>
          <h1 className="cv-name">{personalInfo.fullName || 'Tu Nombre'}</h1>
          <h2 className="cv-title">{personalInfo.jobTitle || 'Puesto que Aplicas'}</h2>
          
          <div className="cv-contact" style={{ justifyContent: 'flex-start' }}>
            {renderContact()}
          </div>
        </div>
      </header>

      {personalInfo.summary && (
        <section className="cv-section">
          <h3 className="section-title">{lang.profile}</h3>
          <p className="cv-summary">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="cv-section">
          <h3 className="section-title">{lang.workExp}</h3>
          {renderExperienceList()}
        </section>
      )}

      {education.length > 0 && (
        <section className="cv-section">
          <h3 className="section-title">{lang.education}</h3>
          {renderEducationList()}
        </section>
      )}

      {skills.length > 0 && (
        <section className="cv-section">
          <h3 className="section-title">{lang.skills}</h3>
          {renderSkillsGrid('cv-skill-tag')}
        </section>
      )}
    </div>
  );
}
