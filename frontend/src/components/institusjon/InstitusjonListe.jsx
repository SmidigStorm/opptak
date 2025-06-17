import React, { useState, useEffect } from 'react';
import institusjonService from '../../services/institusjonService.js';

const InstitusjonListe = ({ onSelectInstitusjon, onNyInstitusjon, onRedigerInstitusjon }) => {
  const [institusjoner, setInstitusjoner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [institusjonstyper, setInstitusjonstyper] = useState([]);

  useEffect(() => {
    hentInstitusjoner(true); // Show loading on initial load
    hentInstitusjonstyper();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      hentInstitusjoner();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, selectedType]);

  const hentInstitusjoner = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await institusjonService.hentAlleInstitusjoner(search, selectedType);
      setInstitusjoner(data);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente institusjoner');
      console.error('Error fetching institusjoner:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const hentInstitusjonstyper = async () => {
    try {
      const typer = await institusjonService.hentInstitusjonstyper();
      setInstitusjonstyper(typer);
    } catch (err) {
      console.error('Error fetching institusjonstyper:', err);
    }
  };

  const handleSlettInstitusjon = async (id, navn) => {
    if (window.confirm(`Er du sikker på at du vil slette "${navn}"?`)) {
      try {
        await institusjonService.slettInstitusjon(id);
        hentInstitusjoner(true); // Show loading when refreshing after delete
      } catch (err) {
        alert('Kunne ikke slette institusjon');
        console.error('Error deleting institusjon:', err);
      }
    }
  };

  if (loading) return <div className="loading">Laster institusjoner...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="institusjon-liste">
      <div className="liste-header">
        <h2>Institusjoner</h2>
        <button 
          className="btn btn-primary"
          onClick={onNyInstitusjon}
        >
          + Ny institusjon
        </button>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Søk etter institusjon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-filter"
          >
            <option value="">Alle typer</option>
            {institusjonstyper.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {institusjoner.length === 0 ? (
        <div className="ingen-resultater">
          <p>Ingen institusjoner funnet</p>
          {(search || selectedType) && (
            <button 
              className="btn btn-secondary"
              onClick={() => { setSearch(''); setSelectedType(''); }}
            >
              Nullstill søk
            </button>
          )}
        </div>
      ) : (
        <div className="institusjon-grid">
          {institusjoner.map(institusjon => (
            <div key={institusjon.id} className="institusjon-card">
              <div className="card-header">
                <h3>{institusjon.institusjonsnavn}</h3>
                <span className="type-badge">{institusjon.type}</span>
              </div>
              
              <div className="card-content">
                <p><strong>Org.nr:</strong> {institusjon.organisasjonsnummer}</p>
                {institusjon.poststed && (
                  <p><strong>Sted:</strong> {institusjon.poststed}</p>
                )}
                {institusjon.epost && (
                  <p><strong>E-post:</strong> {institusjon.epost}</p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => onSelectInstitusjon(institusjon)}
                >
                  Vis detaljer
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => onRedigerInstitusjon(institusjon)}
                >
                  Rediger
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleSlettInstitusjon(institusjon.id, institusjon.institusjonsnavn)}
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstitusjonListe;