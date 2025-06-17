import React, { useState, useEffect } from 'react';
import opptakService from '../../services/opptakService.js';
import institusjonService from '../../services/institusjonService.js';

const OpptakSkjema = ({ opptak, onLagre, onAvbryt }) => {
  const [formData, setFormData] = useState({
    navn: '',
    beskrivelse: '',
    opptakstype: '',
    soknadsfrist: '',
    svarselskapsfrist: '',
    studieopptaksfrist: '',
    semester: '',
    aar: new Date().getFullYear(),
    opptaksomgang: '',
    status: 'Åpen',
    maxSoknaderPerPerson: '',
    institusjonId: '',
    eksternUrl: '',
    opptakInfo: '',
    aktiv: true
  });

  const [institusjoner, setInstitusjoner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const opptakstyper = ['Samordnet opptak', 'Lokalt opptak', 'Direkte opptak'];
  const semestre = ['Høst', 'Vår'];
  const omganger = ['Hovedomgang', 'Tilleggsomgang', 'Løpende'];
  const statuser = ['Åpen', 'Stengt', 'Avsluttet', 'Fremtidig'];

  useEffect(() => {
    hentInstitusjoner();
    
    if (opptak) {
      setFormData({
        navn: opptak.navn || '',
        beskrivelse: opptak.beskrivelse || '',
        opptakstype: opptak.opptakstype || '',
        soknadsfrist: opptak.soknadsfrist || '',
        svarselskapsfrist: opptak.svarselskapsfrist || '',
        studieopptaksfrist: opptak.studieopptaksfrist || '',
        semester: opptak.semester || '',
        aar: opptak.aar || new Date().getFullYear(),
        opptaksomgang: opptak.opptaksomgang || '',
        status: opptak.status || 'Åpen',
        maxSoknaderPerPerson: opptak.maxSoknaderPerPerson || '',
        institusjonId: opptak.institusjon?.id || '',
        eksternUrl: opptak.eksternUrl || '',
        opptakInfo: opptak.opptakInfo || '',
        aktiv: opptak.aktiv !== undefined ? opptak.aktiv : true
      });
    }
  }, [opptak]);

  const hentInstitusjoner = async () => {
    try {
      const data = await institusjonService.hentAlleInstitusjoner();
      setInstitusjoner(data);
    } catch (err) {
      console.error('Error fetching institusjoner:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Fjern feilmelding når bruker begynner å skrive
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validerSkjema = () => {
    const nyeErrors = {};

    if (!formData.navn.trim()) {
      nyeErrors.navn = 'Navn er påkrevd';
    }

    if (!formData.opptakstype) {
      nyeErrors.opptakstype = 'Opptakstype er påkrevd';
    }

    if (!formData.soknadsfrist) {
      nyeErrors.soknadsfrist = 'Søknadsfrist er påkrevd';
    }

    if (!formData.semester) {
      nyeErrors.semester = 'Semester er påkrevd';
    }

    if (!formData.aar || formData.aar < 2020 || formData.aar > 2030) {
      nyeErrors.aar = 'År må være mellom 2020 og 2030';
    }

    // Valider at søknadsfrist ikke er i fortiden (unntatt hvis vi redigerer)
    if (formData.soknadsfrist && !opptak) {
      const soknadsfrist = new Date(formData.soknadsfrist);
      const idag = new Date();
      idag.setHours(0, 0, 0, 0);
      
      if (soknadsfrist < idag) {
        nyeErrors.soknadsfrist = 'Søknadsfrist kan ikke være i fortiden';
      }
    }

    // Valider datoer i riktig rekkefølge
    if (formData.soknadsfrist && formData.svarselskapsfrist) {
      if (new Date(formData.svarselskapsfrist) <= new Date(formData.soknadsfrist)) {
        nyeErrors.svarselskapsfrist = 'Svarselskapsfrist må være etter søknadsfrist';
      }
    }

    if (formData.svarselskapsfrist && formData.studieopptaksfrist) {
      if (new Date(formData.studieopptaksfrist) <= new Date(formData.svarselskapsfrist)) {
        nyeErrors.studieopptaksfrist = 'Studieopptaksfrist må være etter svarselskapsfrist';
      }
    }

    // Valider institusjon for lokale opptak
    if (formData.opptakstype === 'Lokalt opptak' && !formData.institusjonId) {
      nyeErrors.institusjonId = 'Institusjon er påkrevd for lokale opptak';
    }

    setErrors(nyeErrors);
    return Object.keys(nyeErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validerSkjema()) {
      return;
    }

    setLoading(true);
    
    try {
      const opptakData = {
        ...formData,
        institusjon: formData.institusjonId && formData.institusjonId !== 'samordnet' 
          ? { id: formData.institusjonId } 
          : null,
        maxSoknaderPerPerson: formData.maxSoknaderPerPerson ? parseInt(formData.maxSoknaderPerPerson) : null
      };

      // Fjern institusjonId fra data siden vi sender institusjon objektet
      delete opptakData.institusjonId;

      let resultat;
      if (opptak) {
        resultat = await opptakService.oppdaterOpptak(opptak.id, opptakData);
      } else {
        resultat = await opptakService.opprettOpptak(opptakData);
      }

      onLagre(resultat);
    } catch (err) {
      console.error('Error saving opptak:', err);
      setErrors({ submit: 'Kunne ikke lagre opptak. Vennligst prøv igjen.' });
    } finally {
      setLoading(false);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <form onSubmit={handleSubmit} className="opptak-skjema">
      <div className="skjema-header">
        <h2>{opptak ? 'Rediger opptak' : 'Nytt opptak'}</h2>
      </div>

      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <div className="skjema-content">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="navn">Navn *</label>
            <input
              type="text"
              id="navn"
              name="navn"
              value={formData.navn}
              onChange={handleInputChange}
              className={errors.navn ? 'error' : ''}
              placeholder="F.eks. Samordnet opptak høst 2025"
            />
            {errors.navn && <span className="field-error">{errors.navn}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="beskrivelse">Beskrivelse</label>
            <textarea
              id="beskrivelse"
              name="beskrivelse"
              value={formData.beskrivelse}
              onChange={handleInputChange}
              rows="3"
              placeholder="Beskriv opptaket..."
            />
          </div>
        </div>

        <div className="form-row two-columns">
          <div className="form-group">
            <label htmlFor="opptakstype">Opptakstype *</label>
            <select
              id="opptakstype"
              name="opptakstype"
              value={formData.opptakstype}
              onChange={handleInputChange}
              className={errors.opptakstype ? 'error' : ''}
            >
              <option value="">Velg opptakstype</option>
              {opptakstyper.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.opptakstype && <span className="field-error">{errors.opptakstype}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="institusjonId">Institusjon</label>
            <select
              id="institusjonId"
              name="institusjonId"
              value={formData.institusjonId}
              onChange={handleInputChange}
              className={errors.institusjonId ? 'error' : ''}
              disabled={formData.opptakstype === 'Samordnet opptak'}
            >
              <option value="">
                {formData.opptakstype === 'Samordnet opptak' ? 'Samordnet opptak' : 'Velg institusjon'}
              </option>
              {institusjoner.map(institusjon => (
                <option key={institusjon.id} value={institusjon.id}>
                  {institusjon.institusjonsnavn}
                </option>
              ))}
            </select>
            {errors.institusjonId && <span className="field-error">{errors.institusjonId}</span>}
          </div>
        </div>

        <div className="form-row three-columns">
          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className={errors.semester ? 'error' : ''}
            >
              <option value="">Velg semester</option>
              {semestre.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
            {errors.semester && <span className="field-error">{errors.semester}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="aar">År *</label>
            <select
              id="aar"
              name="aar"
              value={formData.aar}
              onChange={handleInputChange}
              className={errors.aar ? 'error' : ''}
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.aar && <span className="field-error">{errors.aar}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="opptaksomgang">Opptaksomgang</label>
            <select
              id="opptaksomgang"
              name="opptaksomgang"
              value={formData.opptaksomgang}
              onChange={handleInputChange}
            >
              <option value="">Velg omgang</option>
              {omganger.map(omgang => (
                <option key={omgang} value={omgang}>{omgang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row three-columns">
          <div className="form-group">
            <label htmlFor="soknadsfrist">Søknadsfrist *</label>
            <input
              type="date"
              id="soknadsfrist"
              name="soknadsfrist"
              value={formData.soknadsfrist}
              onChange={handleInputChange}
              className={errors.soknadsfrist ? 'error' : ''}
            />
            {errors.soknadsfrist && <span className="field-error">{errors.soknadsfrist}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="svarselskapsfrist">Svarselskapsfrist</label>
            <input
              type="date"
              id="svarselskapsfrist"
              name="svarselskapsfrist"
              value={formData.svarselskapsfrist}
              onChange={handleInputChange}
              className={errors.svarselskapsfrist ? 'error' : ''}
            />
            {errors.svarselskapsfrist && <span className="field-error">{errors.svarselskapsfrist}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studieopptaksfrist">Studieopptaksfrist</label>
            <input
              type="date"
              id="studieopptaksfrist"
              name="studieopptaksfrist"
              value={formData.studieopptaksfrist}
              onChange={handleInputChange}
              className={errors.studieopptaksfrist ? 'error' : ''}
            />
            {errors.studieopptaksfrist && <span className="field-error">{errors.studieopptaksfrist}</span>}
          </div>
        </div>

        <div className="form-row two-columns">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              {statuser.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxSoknaderPerPerson">Maks søknader per person</label>
            <input
              type="number"
              id="maxSoknaderPerPerson"
              name="maxSoknaderPerPerson"
              value={formData.maxSoknaderPerPerson}
              onChange={handleInputChange}
              min="1"
              max="20"
              placeholder="F.eks. 12"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="eksternUrl">Ekstern URL</label>
            <input
              type="url"
              id="eksternUrl"
              name="eksternUrl"
              value={formData.eksternUrl}
              onChange={handleInputChange}
              placeholder="https://www.eksempel.no/opptak"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="opptakInfo">Opptaksinformasjon</label>
            <textarea
              id="opptakInfo"
              name="opptakInfo"
              value={formData.opptakInfo}
              onChange={handleInputChange}
              rows="4"
              placeholder="Detaljert informasjon om opptaket..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="aktiv"
                checked={formData.aktiv}
                onChange={handleInputChange}
              />
              Opptak er aktivt
            </label>
          </div>
        </div>
      </div>

      <div className="skjema-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onAvbryt}
          disabled={loading}
        >
          Avbryt
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Lagrer...' : (opptak ? 'Oppdater' : 'Opprett')}
        </button>
      </div>
    </form>
  );
};

export default OpptakSkjema;