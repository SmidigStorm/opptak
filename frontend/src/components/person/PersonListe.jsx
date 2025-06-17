import React, { useState, useEffect } from 'react';
import personService from '../../services/personService.js';

const PersonListe = ({ onSelectPerson, onNyPerson, onRedigerPerson }) => {
  const [personer, setPersoner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedPoststed, setSelectedPoststed] = useState('');
  const [selectedStatsborgerskap, setSelectedStatsborgerskap] = useState('');
  const [statsborgerskap, setStatsborgerskap] = useState([]);

  useEffect(() => {
    hentPersoner(true); // Show loading on initial load
    hentStatsborgerskap();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      hentPersoner();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, selectedPoststed, selectedStatsborgerskap]);

  const hentPersoner = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await personService.hentAllePersoner(search, selectedPoststed, selectedStatsborgerskap);
      setPersoner(data);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente personer');
      console.error('Error fetching personer:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const hentStatsborgerskap = async () => {
    try {
      const data = await personService.hentStatsborgerskap();
      setStatsborgerskap(data);
    } catch (err) {
      console.error('Error fetching statsborgerskap:', err);
    }
  };

  const handleSlettPerson = async (id, navn) => {
    if (window.confirm(`Er du sikker på at du vil slette "${navn}"?`)) {
      try {
        await personService.slettPerson(id);
        hentPersoner(true); // Show loading when refreshing after delete
      } catch (err) {
        alert('Kunne ikke slette person');
        console.error('Error deleting person:', err);
      }
    }
  };

  const beregnAlder = (fodselsdato) => {
    if (!fodselsdato) return null;
    const today = new Date();
    const birthDate = new Date(fodselsdato);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getUnikePoststeder = () => {
    const poststeder = [...new Set(personer
      .map(person => person.poststed)
      .filter(poststed => poststed && poststed.trim() !== '')
    )].sort();
    return poststeder;
  };

  if (loading) return <div className="loading">Laster personer...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="person-liste">
      <div className="liste-header">
        <h2>Personer</h2>
        <button 
          className="btn btn-primary"
          onClick={onNyPerson}
        >
          + Ny person
        </button>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Søk etter navn, e-post eller poststed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={selectedPoststed}
            onChange={(e) => setSelectedPoststed(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle poststeder</option>
            {getUnikePoststeder().map(poststed => (
              <option key={poststed} value={poststed}>{poststed}</option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <select
            value={selectedStatsborgerskap}
            onChange={(e) => setSelectedStatsborgerskap(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle statsborgerskap</option>
            {statsborgerskap.map(land => (
              <option key={land} value={land}>{land}</option>
            ))}
          </select>
        </div>
      </div>

      {personer.length === 0 ? (
        <div className="ingen-resultater">
          <p>Ingen personer funnet</p>
          {(search || selectedPoststed || selectedStatsborgerskap) && (
            <button 
              className="btn btn-secondary"
              onClick={() => { 
                setSearch(''); 
                setSelectedPoststed(''); 
                setSelectedStatsborgerskap(''); 
              }}
            >
              Nullstill søk
            </button>
          )}
        </div>
      ) : (
        <div className="person-grid">
          {personer.map(person => (
            <div key={person.id} className="person-card">
              <div className="card-header">
                <h3>{person.fornavn} {person.mellomnavn ? person.mellomnavn + ' ' : ''}{person.etternavn}</h3>
                {person.fodselsdato && (
                  <span className="age-badge">{beregnAlder(person.fodselsdato)} år</span>
                )}
              </div>
              
              <div className="card-content">
                {person.epost && (
                  <p><strong>E-post:</strong> {person.epost}</p>
                )}
                {person.telefon && (
                  <p><strong>Telefon:</strong> {person.telefon}</p>
                )}
                {person.poststed && (
                  <p><strong>Poststed:</strong> {person.poststed}</p>
                )}
                {person.statsborgerskap && (
                  <p><strong>Statsborgerskap:</strong> {person.statsborgerskap}</p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => onSelectPerson(person)}
                >
                  Vis detaljer
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => onRedigerPerson(person)}
                >
                  Rediger
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleSlettPerson(person.id, `${person.fornavn} ${person.etternavn}`)}
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {personer.length > 0 && (
        <div className="statistikk-section">
          <p className="statistikk-tekst">
            Viser {personer.length} person{personer.length !== 1 ? 'er' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonListe;