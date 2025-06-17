import React, { useState, useEffect } from 'react';
import utdanningstilbudService from '../../services/utdanningstilbudService.js';
import institusjonService from '../../services/institusjonService.js';

const UtdanningstilbudSkjema = ({ utdanningstilbud, onLagre, onAvbryt, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    navn: '',
    beskrivelse: '',
    utdanningsnivaa: '',
    fagomraade: '',
    varighetSemestre: '',
    studiepoeng: '',
    undervisningsspråk: '',
    oppstartssemestre: '',
    opptakskrav: '',
    studieavgift: '',
    kapasitet: '',
    institusjon: null,
    aktiv: true
  });
  const [institusjoner, setInstitusjoner] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const utdanningsnivaaer = ['Bachelor', 'Master', 'PhD', 'Årsstudium', 'Kurs'];
  const fagomraader = [
    'Teknologi og ingeniørfag',
    'Matematikk og naturvitenskap',
    'Medisin og helse',
    'Samfunnsfag',
    'Humaniora',
    'Utdanning',
    'Kunst og kulturstudier',
    'Økonomi og administrasjon',
    'Juss',
    'Primærnæringer'
  ];
  const undervisningsspråkAlternativer = ['Norsk', 'Engelsk', 'Tysk', 'Fransk', 'Spansk'];
  const oppstartssemesterAlternativer = ['Høst', 'Vår', 'Høst,Vår'];

  useEffect(() => {
    hentInstitusjoner();
    
    if (utdanningstilbud) {
      setFormData({
        navn: utdanningstilbud.navn || '',
        beskrivelse: utdanningstilbud.beskrivelse || '',
        utdanningsnivaa: utdanningstilbud.utdanningsnivaa || '',
        fagomraade: utdanningstilbud.fagomraade || '',
        varighetSemestre: utdanningstilbud.varighetSemestre || '',
        studiepoeng: utdanningstilbud.studiepoeng || '',
        undervisningsspråk: utdanningstilbud.undervisningsspråk || '',
        oppstartssemestre: utdanningstilbud.oppstartssemestre || '',
        opptakskrav: utdanningstilbud.opptakskrav || '',
        studieavgift: utdanningstilbud.studieavgift || '',
        kapasitet: utdanningstilbud.kapasitet || '',
        institusjon: utdanningstilbud.institusjon || null,
        aktiv: utdanningstilbud.aktiv !== undefined ? utdanningstilbud.aktiv : true
      });
    }
  }, [utdanningstilbud]);

  const hentInstitusjoner = async () => {
    try {
      const data = await institusjonService.hentAlleInstitusjoner();
      setInstitusjoner(data);
    } catch (err) {
      console.error('Error fetching institusjoner:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInstitusjonChange = (e) => {
    const institusjonId = e.target.value;
    const selectedInstitusjon = institusjoner.find(i => i.id === institusjonId);
    setFormData(prev => ({
      ...prev,
      institusjon: selectedInstitusjon || null
    }));
    
    if (errors.institusjon) {
      setErrors(prev => ({
        ...prev,
        institusjon: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.navn.trim()) {
      newErrors.navn = 'Navn er påkrevd';
    }

    if (!formData.utdanningsnivaa) {
      newErrors.utdanningsnivaa = 'Utdanningsnivå er påkrevd';
    }

    if (!formData.fagomraade) {
      newErrors.fagomraade = 'Fagområde er påkrevd';
    }

    if (!formData.varighetSemestre || formData.varighetSemestre < 1) {
      newErrors.varighetSemestre = 'Varighet må være minst 1 semester';
    }

    if (!formData.studiepoeng || formData.studiepoeng < 1) {
      newErrors.studiepoeng = 'Studiepoeng må være minst 1';
    }

    if (!formData.institusjon) {
      newErrors.institusjon = 'Institusjon er påkrevd';
    }

    if (formData.studieavgift && formData.studieavgift < 0) {
      newErrors.studieavgift = 'Studieavgift kan ikke være negativ';
    }

    if (formData.kapasitet && formData.kapasitet < 1) {
      newErrors.kapasitet = 'Kapasitet må være minst 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const cleanedData = {
        ...formData,
        varighetSemestre: parseInt(formData.varighetSemestre),
        studiepoeng: parseInt(formData.studiepoeng),
        studieavgift: formData.studieavgift ? parseInt(formData.studieavgift) : null,
        kapasitet: formData.kapasitet ? parseInt(formData.kapasitet) : null,
        beskrivelse: formData.beskrivelse.trim() || null,
        undervisningsspråk: formData.undervisningsspråk || null,
        oppstartssemestre: formData.oppstartssemestre || null,
        opptakskrav: formData.opptakskrav.trim() || null
      };

      let result;
      if (mode === 'edit' && utdanningstilbud) {
        result = await utdanningstilbudService.oppdaterUtdanningstilbud(utdanningstilbud.id, cleanedData);
      } else {
        result = await utdanningstilbudService.opprettUtdanningstilbud(cleanedData);
      }
      
      onLagre(result);
    } catch (err) {
      if (err.message.includes('400')) {
        alert('Ugyldig data. Sjekk at alle felt er riktig utfylt.');
      } else {
        alert('Kunne ikke lagre utdanningstilbud');
      }
      console.error('Error saving utdanningstilbud:', err);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="utdanningstilbud-skjema">
      <h2>{isEdit ? 'Rediger utdanningstilbud' : 'Nytt utdanningstilbud'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="navn">Navn *</label>
          <input
            type="text"
            id="navn"
            name="navn"
            value={formData.navn}
            onChange={handleChange}
            className={errors.navn ? 'error' : ''}
            required
          />
          {errors.navn && <span className="error-message">{errors.navn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="beskrivelse">Beskrivelse</label>
          <textarea
            id="beskrivelse"
            name="beskrivelse"
            value={formData.beskrivelse}
            onChange={handleChange}
            rows="4"
            placeholder="Beskriv utdanningstilbudet..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="utdanningsnivaa">Utdanningsnivå *</label>
            <select
              id="utdanningsnivaa"
              name="utdanningsnivaa"
              value={formData.utdanningsnivaa}
              onChange={handleChange}
              className={errors.utdanningsnivaa ? 'error' : ''}
              required
            >
              <option value="">Velg utdanningsnivå</option>
              {utdanningsnivaaer.map(nivaa => (
                <option key={nivaa} value={nivaa}>{nivaa}</option>
              ))}
            </select>
            {errors.utdanningsnivaa && <span className="error-message">{errors.utdanningsnivaa}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fagomraade">Fagområde *</label>
            <select
              id="fagomraade"
              name="fagomraade"
              value={formData.fagomraade}
              onChange={handleChange}
              className={errors.fagomraade ? 'error' : ''}
              required
            >
              <option value="">Velg fagområde</option>
              {fagomraader.map(fagomraade => (
                <option key={fagomraade} value={fagomraade}>{fagomraade}</option>
              ))}
            </select>
            {errors.fagomraade && <span className="error-message">{errors.fagomraade}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="varighetSemestre">Varighet (semestre) *</label>
            <input
              type="number"
              id="varighetSemestre"
              name="varighetSemestre"
              value={formData.varighetSemestre}
              onChange={handleChange}
              className={errors.varighetSemestre ? 'error' : ''}
              min="1"
              required
            />
            {errors.varighetSemestre && <span className="error-message">{errors.varighetSemestre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studiepoeng">Studiepoeng *</label>
            <input
              type="number"
              id="studiepoeng"
              name="studiepoeng"
              value={formData.studiepoeng}
              onChange={handleChange}
              className={errors.studiepoeng ? 'error' : ''}
              min="1"
              required
            />
            {errors.studiepoeng && <span className="error-message">{errors.studiepoeng}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="undervisningsspråk">Undervisningsspråk</label>
            <select
              id="undervisningsspråk"
              name="undervisningsspråk"
              value={formData.undervisningsspråk}
              onChange={handleChange}
            >
              <option value="">Velg språk</option>
              {undervisningsspråkAlternativer.map(språk => (
                <option key={språk} value={språk}>{språk}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="oppstartssemestre">Oppstartssemestre</label>
            <select
              id="oppstartssemestre"
              name="oppstartssemestre"
              value={formData.oppstartssemestre}
              onChange={handleChange}
            >
              <option value="">Velg oppstartssemestre</option>
              {oppstartssemesterAlternativer.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="institusjon">Institusjon *</label>
          <select
            id="institusjon"
            name="institusjon"
            value={formData.institusjon?.id || ''}
            onChange={handleInstitusjonChange}
            className={errors.institusjon ? 'error' : ''}
            required
          >
            <option value="">Velg institusjon</option>
            {institusjoner.map(institusjon => (
              <option key={institusjon.id} value={institusjon.id}>{institusjon.institusjonsnavn}</option>
            ))}
          </select>
          {errors.institusjon && <span className="error-message">{errors.institusjon}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="opptakskrav">Opptakskrav</label>
          <textarea
            id="opptakskrav"
            name="opptakskrav"
            value={formData.opptakskrav}
            onChange={handleChange}
            rows="3"
            placeholder="Beskriv opptakskrav og forkunnskaper..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studieavgift">Studieavgift (per år, NOK)</label>
            <input
              type="number"
              id="studieavgift"
              name="studieavgift"
              value={formData.studieavgift}
              onChange={handleChange}
              className={errors.studieavgift ? 'error' : ''}
              min="0"
              placeholder="0 for gratis"
            />
            {errors.studieavgift && <span className="error-message">{errors.studieavgift}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="kapasitet">Kapasitet (studenter per år)</label>
            <input
              type="number"
              id="kapasitet"
              name="kapasitet"
              value={formData.kapasitet}
              onChange={handleChange}
              className={errors.kapasitet ? 'error' : ''}
              min="1"
            />
            {errors.kapasitet && <span className="error-message">{errors.kapasitet}</span>}
          </div>
        </div>

        {isEdit && (
          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="aktiv"
                checked={formData.aktiv}
                onChange={handleChange}
              />
              Aktiv
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onAvbryt} className="btn btn-secondary">
            Avbryt
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Lagrer...' : (isEdit ? 'Oppdater' : 'Opprett')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UtdanningstilbudSkjema;