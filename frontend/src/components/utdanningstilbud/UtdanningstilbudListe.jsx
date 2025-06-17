import React, { useState, useEffect } from 'react';
import utdanningstilbudService from '../../services/utdanningstilbudService.js';
import institusjonService from '../../services/institusjonService.js';

const UtdanningstilbudListe = ({ onSelectUtdanningstilbud, onNyUtdanningstilbud, onRedigerUtdanningstilbud }) => {
  const [utdanningstilbud, setUtdanningstilbud] = useState([]);
  const [institusjoner, setInstitusjoner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedUtdanningsnivaa, setSelectedUtdanningsnivaa] = useState('');
  const [selectedFagomraade, setSelectedFagomraade] = useState('');
  const [selectedInstitusjon, setSelectedInstitusjon] = useState('');
  const [selectedUndervisningsspråk, setSelectedUndervisningsspråk] = useState('');
  const [utdanningsnivaaer, setUtdanningsnivaaer] = useState([]);
  const [fagomraader, setFagomraader] = useState([]);
  const [undervisningsspråk, setUndervisningsspråk] = useState([]);
  const [kunAktive, setKunAktive] = useState(true);

  useEffect(() => {
    hentUtdanningstilbud(true);
    hentFilterData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      hentUtdanningstilbud();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedUtdanningsnivaa, selectedFagomraade, selectedInstitusjon, selectedUndervisningsspråk, kunAktive]);

  const hentUtdanningstilbud = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await utdanningstilbudService.hentAlleUtdanningstilbud(
        search, 
        selectedUtdanningsnivaa, 
        selectedFagomraade, 
        selectedInstitusjon, 
        selectedUndervisningsspråk, 
        '', 
        kunAktive
      );
      setUtdanningstilbud(data);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente utdanningstilbud');
      console.error('Error fetching utdanningstilbud:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const hentFilterData = async () => {
    try {
      const [institusjonerData, utdanningsnivaaerData, fagomraaderData, undervisningsspråkData] = await Promise.all([
        institusjonService.hentAlleInstitusjoner(),
        utdanningstilbudService.hentUtdanningsnivaaer(),
        utdanningstilbudService.hentFagomraader(),
        utdanningstilbudService.hentUndervisningsspråk()
      ]);
      
      setInstitusjoner(institusjonerData);
      setUtdanningsnivaaer(utdanningsnivaaerData);
      setFagomraader(fagomraaderData);
      setUndervisningsspråk(undervisningsspråkData);
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  const handleSlettUtdanningstilbud = async (id, navn) => {
    if (window.confirm(`Er du sikker på at du vil slette "${navn}"?`)) {
      try {
        await utdanningstilbudService.slettUtdanningstilbud(id);
        hentUtdanningstilbud(true);
      } catch (err) {
        alert('Kunne ikke slette utdanningstilbud');
        console.error('Error deleting utdanningstilbud:', err);
      }
    }
  };

  const handleToggleAktiv = async (id, aktiv) => {
    try {
      if (aktiv) {
        await utdanningstilbudService.deaktiverUtdanningstilbud(id);
      } else {
        await utdanningstilbudService.aktiverUtdanningstilbud(id);
      }
      hentUtdanningstilbud(true);
    } catch (err) {
      alert('Kunne ikke endre status');
      console.error('Error toggling status:', err);
    }
  };

  const formatStudiepoeng = (studiepoeng) => {
    return `${studiepoeng} sp`;
  };

  const formatVarighet = (semestre) => {
    const år = Math.floor(semestre / 2);
    const restSemestre = semestre % 2;
    
    if (år === 0) {
      return `${semestre} sem`;
    } else if (restSemestre === 0) {
      return `${år} år`;
    } else {
      return `${år},5 år`;
    }
  };

  const getInstitusjonNavn = (institusjonId) => {
    const institusjon = institusjoner.find(i => i.id === institusjonId);
    return institusjon ? institusjon.institusjonsnavn : 'Ukjent institusjon';
  };

  if (loading) return <div className="loading">Laster utdanningstilbud...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="utdanningstilbud-liste">
      <div className="liste-header">
        <h2>Utdanningstilbud</h2>
        <button 
          className="btn btn-primary"
          onClick={onNyUtdanningstilbud}
        >
          + Nytt utdanningstilbud
        </button>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Søk etter navn, beskrivelse, fagområde eller institusjon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-container">
            <select
              value={selectedUtdanningsnivaa}
              onChange={(e) => setSelectedUtdanningsnivaa(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle utdanningsnivå</option>
              {utdanningsnivaaer.map(nivaa => (
                <option key={nivaa} value={nivaa}>{nivaa}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <select
              value={selectedFagomraade}
              onChange={(e) => setSelectedFagomraade(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle fagområder</option>
              {fagomraader.map(fagomraade => (
                <option key={fagomraade} value={fagomraade}>{fagomraade}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <select
              value={selectedInstitusjon}
              onChange={(e) => setSelectedInstitusjon(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle institusjoner</option>
              {institusjoner.map(institusjon => (
                <option key={institusjon.id} value={institusjon.id}>{institusjon.institusjonsnavn}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <select
              value={selectedUndervisningsspråk}
              onChange={(e) => setSelectedUndervisningsspråk(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle språk</option>
              {undervisningsspråk.map(språk => (
                <option key={språk} value={språk}>{språk}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={kunAktive}
                onChange={(e) => setKunAktive(e.target.checked)}
              />
              Kun aktive
            </label>
          </div>
        </div>
      </div>

      {utdanningstilbud.length === 0 ? (
        <div className="ingen-resultater">
          <p>Ingen utdanningstilbud funnet</p>
          {(search || selectedUtdanningsnivaa || selectedFagomraade || selectedInstitusjon || selectedUndervisningsspråk) && (
            <button 
              className="btn btn-secondary"
              onClick={() => { 
                setSearch(''); 
                setSelectedUtdanningsnivaa(''); 
                setSelectedFagomraade('');
                setSelectedInstitusjon('');
                setSelectedUndervisningsspråk('');
              }}
            >
              Nullstill søk
            </button>
          )}
        </div>
      ) : (
        <div className="utdanningstilbud-grid">
          {utdanningstilbud.map(tilbud => (
            <div key={tilbud.id} className={`utdanningstilbud-card ${!tilbud.aktiv ? 'inactive' : ''}`}>
              <div className="card-header">
                <h3>{tilbud.navn}</h3>
                <div className="card-badges">
                  <span className="badge level-badge">{tilbud.utdanningsnivaa}</span>
                  {!tilbud.aktiv && <span className="badge inactive-badge">Inaktiv</span>}
                </div>
              </div>
              
              <div className="card-content">
                <p><strong>Fagområde:</strong> {tilbud.fagomraade}</p>
                <p><strong>Institusjon:</strong> {getInstitusjonNavn(tilbud.institusjon?.id)}</p>
                <p><strong>Varighet:</strong> {formatVarighet(tilbud.varighetSemestre)}</p>
                <p><strong>Studiepoeng:</strong> {formatStudiepoeng(tilbud.studiepoeng)}</p>
                {tilbud.undervisningsspråk && (
                  <p><strong>Språk:</strong> {tilbud.undervisningsspråk}</p>
                )}
                {tilbud.oppstartssemestre && (
                  <p><strong>Oppstart:</strong> {tilbud.oppstartssemestre}</p>
                )}
                {tilbud.beskrivelse && (
                  <p className="beskrivelse">{tilbud.beskrivelse.length > 100 ? tilbud.beskrivelse.substring(0, 100) + '...' : tilbud.beskrivelse}</p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => onSelectUtdanningstilbud(tilbud)}
                >
                  Vis detaljer
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => onRedigerUtdanningstilbud(tilbud)}
                >
                  Rediger
                </button>
                <button 
                  className={`btn ${tilbud.aktiv ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => handleToggleAktiv(tilbud.id, tilbud.aktiv)}
                >
                  {tilbud.aktiv ? 'Deaktiver' : 'Aktiver'}
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleSlettUtdanningstilbud(tilbud.id, tilbud.navn)}
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {utdanningstilbud.length > 0 && (
        <div className="statistikk-section">
          <p className="statistikk-tekst">
            Viser {utdanningstilbud.length} utdanningstilbud
          </p>
        </div>
      )}
    </div>
  );
};

export default UtdanningstilbudListe;