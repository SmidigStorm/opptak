import React, { useState, useEffect } from 'react';
import institusjonService from '../../services/institusjonService.js';

const InstitusjonSkjema = ({ institusjon, onLagre, onAvbryt, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    institusjonsnavn: '',
    organisasjonsnummer: '',
    type: '',
    adresse: '',
    postnummer: '',
    poststed: '',
    epost: '',
    telefon: '',
    spesialiseringsomrade: '',
    akkrediteringsstatus: ''
  });
  const [institusjonstyper, setInstitusjonstyper] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hentInstitusjonstyper();
    
    if (institusjon) {
      setFormData({
        institusjonsnavn: institusjon.institusjonsnavn || '',
        organisasjonsnummer: institusjon.organisasjonsnummer || '',
        type: institusjon.type || '',
        adresse: institusjon.adresse || '',
        postnummer: institusjon.postnummer || '',
        poststed: institusjon.poststed || '',
        epost: institusjon.epost || '',
        telefon: institusjon.telefon || '',
        spesialiseringsomrade: institusjon.spesialiseringsomrade || '',
        akkrediteringsstatus: institusjon.akkrediteringsstatus || ''
      });
    }
  }, [institusjon]);

  const hentInstitusjonstyper = async () => {
    try {
      const typer = await institusjonService.hentInstitusjonstyper();
      setInstitusjonstyper(typer);
    } catch (err) {
      console.error('Error fetching institusjonstyper:', err);
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

    if (!formData.institusjonsnavn.trim()) {
      newErrors.institusjonsnavn = 'Institusjonsnavn er påkrevd';
    }

    if (!formData.organisasjonsnummer.trim()) {
      newErrors.organisasjonsnummer = 'Organisasjonsnummer er påkrevd';
    } else if (!/^\d{9}$/.test(formData.organisasjonsnummer)) {
      newErrors.organisasjonsnummer = 'Organisasjonsnummer må være 9 siffer';
    }

    if (!formData.type) {
      newErrors.type = 'Institusjonstype er påkrevd';
    }

    if (formData.postnummer && !/^\d{4}$/.test(formData.postnummer)) {
      newErrors.postnummer = 'Postnummer må være 4 siffer';
    }

    if (formData.epost && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.epost)) {
      newErrors.epost = 'Ugyldig e-postformat';
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
      let result;
      if (mode === 'edit' && institusjon) {
        result = await institusjonService.oppdaterInstitusjon(institusjon.id, formData);
      } else {
        result = await institusjonService.opprettInstitusjon(formData);
      }
      
      onLagre(result);
    } catch (err) {
      if (err.message.includes('409')) {
        setErrors({ organisasjonsnummer: 'En institusjon med dette organisasjonsnummeret eksisterer allerede' });
      } else {
        alert('Kunne ikke lagre institusjon');
      }
      console.error('Error saving institusjon:', err);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="institusjon-skjema">
      <h2>{isEdit ? 'Rediger institusjon' : 'Ny institusjon'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="institusjonsnavn">Institusjonsnavn *</label>
          <input
            type="text"
            id="institusjonsnavn"
            name="institusjonsnavn"
            value={formData.institusjonsnavn}
            onChange={handleChange}
            className={errors.institusjonsnavn ? 'error' : ''}
            required
          />
          {errors.institusjonsnavn && <span className="error-message">{errors.institusjonsnavn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="organisasjonsnummer">Organisasjonsnummer *</label>
          <input
            type="text"
            id="organisasjonsnummer"
            name="organisasjonsnummer"
            value={formData.organisasjonsnummer}
            onChange={handleChange}
            className={errors.organisasjonsnummer ? 'error' : ''}
            disabled={isEdit}
            placeholder="9 siffer"
            required
          />
          {errors.organisasjonsnummer && <span className="error-message">{errors.organisasjonsnummer}</span>}
          {isEdit && <small>Organisasjonsnummer kan ikke endres</small>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Institusjonstype *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
            required
          >
            <option value="">Velg type</option>
            {institusjonstyper.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
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
          />
        </div>

        {(formData.type === 'Høyskole' || formData.type === 'Privat høyskole') && (
          <div className="form-group">
            <label htmlFor="spesialiseringsomrade">Spesialiseringsområde</label>
            <textarea
              id="spesialiseringsomrade"
              name="spesialiseringsomrade"
              value={formData.spesialiseringsomrade}
              onChange={handleChange}
              rows="3"
            />
          </div>
        )}

        {formData.type === 'Privat høyskole' && (
          <div className="form-group">
            <label htmlFor="akkrediteringsstatus">Akkrediteringsstatus</label>
            <select
              id="akkrediteringsstatus"
              name="akkrediteringsstatus"
              value={formData.akkrediteringsstatus}
              onChange={handleChange}
            >
              <option value="">Ikke spesifisert</option>
              <option value="Akkreditert">Akkreditert</option>
              <option value="Under vurdering">Under vurdering</option>
              <option value="Ikke akkreditert">Ikke akkreditert</option>
            </select>
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

export default InstitusjonSkjema;