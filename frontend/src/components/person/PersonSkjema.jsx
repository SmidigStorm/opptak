import React, { useState, useEffect } from 'react';
import personService from '../../services/personService.js';

const PersonSkjema = ({ person, onLagre, onAvbryt, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    fornavn: '',
    mellomnavn: '',
    etternavn: '',
    fodselsnummer: '',
    fodselsdato: '',
    epost: '',
    telefon: '',
    adresse: '',
    postnummer: '',
    poststed: '',
    statsborgerskap: ''
  });
  const [statsborgerskap, setStatsborgerskap] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hentStatsborgerskap();
    
    if (person) {
      setFormData({
        fornavn: person.fornavn || '',
        mellomnavn: person.mellomnavn || '',
        etternavn: person.etternavn || '',
        fodselsnummer: person.fodselsnummer || '',
        fodselsdato: person.fodselsdato || '',
        epost: person.epost || '',
        telefon: person.telefon || '',
        adresse: person.adresse || '',
        postnummer: person.postnummer || '',
        poststed: person.poststed || '',
        statsborgerskap: person.statsborgerskap || ''
      });
    }
  }, [person]);

  const hentStatsborgerskap = async () => {
    try {
      const data = await personService.hentStatsborgerskap();
      setStatsborgerskap(data);
    } catch (err) {
      console.error('Error fetching statsborgerskap:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fornavn.trim()) {
      newErrors.fornavn = 'Fornavn er påkrevd';
    }

    if (!formData.etternavn.trim()) {
      newErrors.etternavn = 'Etternavn er påkrevd';
    }

    if (formData.fodselsnummer && !/^\d{11}$/.test(formData.fodselsnummer)) {
      newErrors.fodselsnummer = 'Fødselsnummer må være 11 siffer';
    }

    if (formData.epost && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.epost)) {
      newErrors.epost = 'Ugyldig e-postformat';
    }

    if (formData.telefon && !/^(\+47)?[0-9]{8}$/.test(formData.telefon.replace(/\s/g, ''))) {
      newErrors.telefon = 'Ugyldig telefonnummer (8 siffer, eventuelt med +47)';
    }

    if (formData.postnummer && !/^\d{4}$/.test(formData.postnummer)) {
      newErrors.postnummer = 'Postnummer må være 4 siffer';
    }

    if (formData.fodselsdato) {
      const birthDate = new Date(formData.fodselsdato);
      const today = new Date();
      if (birthDate > today) {
        newErrors.fodselsdato = 'Fødselsdato kan ikke være i fremtiden';
      }
      if (birthDate < new Date('1900-01-01')) {
        newErrors.fodselsdato = 'Fødselsdato kan ikke være før 1900';
      }
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
      // Clean up data before sending
      const cleanedData = {
        ...formData,
        fodselsdato: formData.fodselsdato || null,
        mellomnavn: formData.mellomnavn.trim() || null,
        telefon: formData.telefon.replace(/\s/g, '') || null
      };

      let result;
      if (mode === 'edit' && person) {
        result = await personService.oppdaterPerson(person.id, cleanedData);
      } else {
        result = await personService.opprettPerson(cleanedData);
      }
      
      onLagre(result);
    } catch (err) {
      if (err.message.includes('409')) {
        if (formData.fodselsnummer) {
          setErrors({ fodselsnummer: 'En person med dette fødselsnummeret eksisterer allerede' });
        } else if (formData.epost) {
          setErrors({ epost: 'En person med denne e-postadressen eksisterer allerede' });
        }
      } else {
        alert('Kunne ikke lagre person');
      }
      console.error('Error saving person:', err);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="person-skjema">
      <h2>{isEdit ? 'Rediger person' : 'Ny person'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fornavn">Fornavn *</label>
            <input
              type="text"
              id="fornavn"
              name="fornavn"
              value={formData.fornavn}
              onChange={handleChange}
              className={errors.fornavn ? 'error' : ''}
              required
            />
            {errors.fornavn && <span className="error-message">{errors.fornavn}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mellomnavn">Mellomnavn</label>
            <input
              type="text"
              id="mellomnavn"
              name="mellomnavn"
              value={formData.mellomnavn}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="etternavn">Etternavn *</label>
            <input
              type="text"
              id="etternavn"
              name="etternavn"
              value={formData.etternavn}
              onChange={handleChange}
              className={errors.etternavn ? 'error' : ''}
              required
            />
            {errors.etternavn && <span className="error-message">{errors.etternavn}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fodselsnummer">Fødselsnummer</label>
            <input
              type="text"
              id="fodselsnummer"
              name="fodselsnummer"
              value={formData.fodselsnummer}
              onChange={handleChange}
              className={errors.fodselsnummer ? 'error' : ''}
              placeholder="11 siffer"
              maxLength="11"
            />
            {errors.fodselsnummer && <span className="error-message">{errors.fodselsnummer}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fodselsdato">Fødselsdato</label>
            <input
              type="date"
              id="fodselsdato"
              name="fodselsdato"
              value={formData.fodselsdato}
              onChange={handleChange}
              className={errors.fodselsdato ? 'error' : ''}
            />
            {errors.fodselsdato && <span className="error-message">{errors.fodselsdato}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="epost">E-post</label>
            <input
              type="email"
              id="epost"
              name="epost"
              value={formData.epost}
              onChange={handleChange}
              className={errors.epost ? 'error' : ''}
            />
            {errors.epost && <span className="error-message">{errors.epost}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefon">Telefon</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              className={errors.telefon ? 'error' : ''}
              placeholder="12345678 eller +4712345678"
            />
            {errors.telefon && <span className="error-message">{errors.telefon}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="adresse">Adresse</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postnummer">Postnummer</label>
            <input
              type="text"
              id="postnummer"
              name="postnummer"
              value={formData.postnummer}
              onChange={handleChange}
              className={errors.postnummer ? 'error' : ''}
              placeholder="4 siffer"
              maxLength="4"
            />
            {errors.postnummer && <span className="error-message">{errors.postnummer}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="poststed">Poststed</label>
            <input
              type="text"
              id="poststed"
              name="poststed"
              value={formData.poststed}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="statsborgerskap">Statsborgerskap</label>
          <select
            id="statsborgerskap"
            name="statsborgerskap"
            value={formData.statsborgerskap}
            onChange={handleChange}
          >
            <option value="">Velg statsborgerskap</option>
            {statsborgerskap.map(land => (
              <option key={land} value={land}>{land}</option>
            ))}
          </select>
        </div>

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

export default PersonSkjema;