import React, { useState, useEffect } from 'react';
import opptakService from '../../services/opptakService.js';
import institusjonService from '../../services/institusjonService.js';

const OpptakListe = ({ onSelectOpptak, onNyOpptak, onRedigerOpptak }) => {
  const [opptak, setOpptak] = useState([]);
  const [institusjoner, setInstitusjoner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedOpptakstype, setSelectedOpptakstype] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedAar, setSelectedAar] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedInstitusjon, setSelectedInstitusjon] = useState('');
  const [opptakstyper, setOpptakstyper] = useState([]);
  const [semestre, setSemestre] = useState([]);
  const [aar, setAar] = useState([]);
  const [statuser, setStatuser] = useState([]);
  const [kunAktive, setKunAktive] = useState(true);

  useEffect(() => {
    hentOpptak(true);
    hentFilterData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      hentOpptak();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedOpptakstype, selectedSemester, selectedAar, selectedStatus, selectedInstitusjon, kunAktive]);

  const hentOpptak = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await opptakService.hentAlleOpptak(
        search,
        selectedOpptakstype,
        selectedSemester,
        selectedAar,
        selectedStatus,
        selectedInstitusjon,
        kunAktive
      );
      setOpptak(data);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente opptak');
      console.error('Error fetching opptak:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const hentFilterData = async () => {
    try {
      const [institusjonerData, opptakstyperData, semestreData, aarData, statuserData] = await Promise.all([
        institusjonService.hentAlleInstitusjoner(),
        opptakService.hentOpptakstyper(),
        opptakService.hentSemestre(),
        opptakService.hentAar(),
        opptakService.hentStatuser()
      ]);
      
      setInstitusjoner(institusjonerData);
      setOpptakstyper(opptakstyperData);
      setSemestre(semestreData);
      setAar(aarData);
      setStatuser(statuserData);
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  const handleSlettOpptak = async (id, navn) => {
    if (window.confirm(`Er du sikker på at du vil slette "${navn}"?`)) {
      try {
        await opptakService.slettOpptak(id);
        hentOpptak(true);
      } catch (err) {
        alert('Kunne ikke slette opptak');
        console.error('Error deleting opptak:', err);
      }
    }
  };

  const handleToggleAktiv = async (id, aktiv) => {
    try {
      if (aktiv) {
        await opptakService.deaktiverOpptak(id);
      } else {
        await opptakService.aktiverOpptak(id);
      }
      hentOpptak(true);
    } catch (err) {
      alert('Kunne ikke endre status');
      console.error('Error toggling status:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('nb-NO');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'åpen': return 'status-open';
      case 'stengt': return 'status-closed';
      case 'avsluttet': return 'status-finished';
      case 'fremtidig': return 'status-future';
      default: return 'status-unknown';
    }
  };

  const getInstitusjonNavn = (institusjonId) => {
    if (!institusjonId) return 'Samordnet opptak';
    const institusjon = institusjoner.find(i => i.id === institusjonId);
    return institusjon ? institusjon.institusjonsnavn : 'Ukjent institusjon';
  };

  const getDaysUntilDeadline = (soknadsfrist) => {
    if (!soknadsfrist) return null;
    const today = new Date();
    const deadline = new Date(soknadsfrist);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineText = (soknadsfrist) => {
    const days = getDaysUntilDeadline(soknadsfrist);
    if (days === null) return '';
    
    if (days < 0) {
      return `Utløpt for ${Math.abs(days)} dager siden`;
    } else if (days === 0) {
      return 'Utløper i dag!';
    } else if (days === 1) {
      return 'Utløper i morgen!';
    } else if (days <= 7) {
      return `${days} dager igjen`;
    } else {
      return `${days} dager igjen`;
    }
  };

  if (loading) return <div className="loading">Laster opptak...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="opptak-liste">
      <div className="liste-header">
        <h2>Opptak</h2>
        <button 
          className="btn btn-primary"
          onClick={onNyOpptak}
        >
          + Nytt opptak
        </button>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Søk etter navn, type, semester eller år..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-container">
            <select
              value={selectedOpptakstype}
              onChange={(e) => setSelectedOpptakstype(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle opptakstyper</option>
              {opptakstyper.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle semestre</option>
              {semestre.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <select
              value={selectedAar}
              onChange={(e) => setSelectedAar(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle år</option>
              {aar.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle statuser</option>
              {statuser.map(status => (
                <option key={status} value={status}>{status}</option>
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
              <option value="samordnet">Samordnet opptak</option>
              {institusjoner.map(institusjon => (
                <option key={institusjon.id} value={institusjon.id}>{institusjon.institusjonsnavn}</option>
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

      {opptak.length === 0 ? (
        <div className="ingen-resultater">
          <p>Ingen opptak funnet</p>
          {(search || selectedOpptakstype || selectedSemester || selectedAar || selectedStatus || selectedInstitusjon) && (
            <button 
              className="btn btn-secondary"
              onClick={() => { 
                setSearch(''); 
                setSelectedOpptakstype(''); 
                setSelectedSemester('');
                setSelectedAar('');
                setSelectedStatus('');
                setSelectedInstitusjon('');
              }}
            >
              Nullstill søk
            </button>
          )}
        </div>
      ) : (
        <div className="opptak-grid">
          {opptak.map(tilbud => (
            <div key={tilbud.id} className={`opptak-card ${!tilbud.aktiv ? 'inactive' : ''}`}>
              <div className="card-header">
                <h3>{tilbud.navn}</h3>
                <div className="card-badges">
                  <span className={`badge status-badge ${getStatusColor(tilbud.status)}`}>
                    {tilbud.status}
                  </span>
                  {!tilbud.aktiv && <span className="badge inactive-badge">Inaktiv</span>}
                </div>
              </div>
              
              <div className="card-content">
                <p><strong>Type:</strong> {tilbud.opptakstype}</p>
                <p><strong>Periode:</strong> {tilbud.semester} {tilbud.aar}</p>
                <p><strong>Institusjon:</strong> {getInstitusjonNavn(tilbud.institusjon?.id)}</p>
                <p><strong>Søknadsfrist:</strong> {formatDate(tilbud.soknadsfrist)}</p>
                
                {tilbud.soknadsfrist && (
                  <div className={`deadline-info ${getDaysUntilDeadline(tilbud.soknadsfrist) <= 7 ? 'urgent' : ''}`}>
                    {getDeadlineText(tilbud.soknadsfrist)}
                  </div>
                )}

                {tilbud.opptaksomgang && (
                  <p><strong>Omgang:</strong> {tilbud.opptaksomgang}</p>
                )}
                
                {tilbud.beskrivelse && (
                  <p className="beskrivelse">
                    {tilbud.beskrivelse.length > 150 
                      ? tilbud.beskrivelse.substring(0, 150) + '...' 
                      : tilbud.beskrivelse}
                  </p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => onSelectOpptak(tilbud)}
                >
                  Vis detaljer
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => onRedigerOpptak(tilbud)}
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
                  onClick={() => handleSlettOpptak(tilbud.id, tilbud.navn)}
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {opptak.length > 0 && (
        <div className="statistikk-section">
          <p className="statistikk-tekst">
            Viser {opptak.length} opptak
          </p>
        </div>
      )}
    </div>
  );
};

export default OpptakListe;