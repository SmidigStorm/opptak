import React, { useState, useEffect } from 'react';
import opptakService from '../../services/opptakService.js';

const OpptakDetaljer = ({ opptakId, opptak: initialOpptak, onTilbake, onRediger }) => {
  const [opptak, setOpptak] = useState(initialOpptak);
  const [loading, setLoading] = useState(!initialOpptak && !!opptakId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (opptakId && !initialOpptak) {
      hentOpptak();
    }
  }, [opptakId, initialOpptak]);

  const hentOpptak = async () => {
    try {
      setLoading(true);
      const data = await opptakService.hentOpptak(opptakId);
      setOpptak(data);
      setError(null);
    } catch (err) {
      setError('Kunne ikke hente opptaksdetaljer');
      console.error('Error fetching opptak details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ikke satt';
    return new Date(dateString).toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Ikke satt';
    return new Date(dateString).toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getDaysUntilDeadline = (soknadsfrist) => {
    if (!soknadsfrist) return null;
    const today = new Date();
    const deadline = new Date(soknadsfrist);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineInfo = (soknadsfrist) => {
    const days = getDaysUntilDeadline(soknadsfrist);
    if (days === null) return null;
    
    if (days < 0) {
      return {
        text: `Utløpt for ${Math.abs(days)} dager siden`,
        className: 'deadline-expired'
      };
    } else if (days === 0) {
      return {
        text: 'Utløper i dag!',
        className: 'deadline-today'
      };
    } else if (days === 1) {
      return {
        text: 'Utløper i morgen!',
        className: 'deadline-tomorrow'
      };
    } else if (days <= 7) {
      return {
        text: `${days} dager igjen`,
        className: 'deadline-soon'
      };
    } else {
      return {
        text: `${days} dager igjen`,
        className: 'deadline-normal'
      };
    }
  };

  const getInstitusjonInfo = (institusjon) => {
    if (!institusjon) {
      return {
        navn: 'Samordnet opptak',
        type: 'Nasjonalt'
      };
    }
    return {
      navn: institusjon.institusjonsnavn || 'Ukjent institusjon',
      type: 'Lokalt'
    };
  };

  if (loading) return <div className="loading">Laster opptaksdetaljer...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!opptak) return <div className="error">Opptak ikke funnet</div>;

  const deadlineInfo = getDeadlineInfo(opptak.soknadsfrist);
  const institusjonInfo = getInstitusjonInfo(opptak.institusjon);

  return (
    <div className="opptak-detaljer">
      <div className="detaljer-header">
        <div className="header-left">
          <button 
            className="btn btn-outline btn-back"
            onClick={onTilbake}
          >
            ← Tilbake
          </button>
          <div className="title-section">
            <h1>{opptak.navn}</h1>
            <div className="badges">
              <span className={`badge status-badge ${getStatusColor(opptak.status)}`}>
                {opptak.status}
              </span>
              {!opptak.aktiv && <span className="badge inactive-badge">Inaktiv</span>}
              <span className="badge type-badge">{opptak.opptakstype}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => onRediger(opptak)}
          >
            Rediger
          </button>
        </div>
      </div>

      <div className="detaljer-content">
        {deadlineInfo && (
          <div className={`deadline-highlight ${deadlineInfo.className}`}>
            <strong>Søknadsfrist: </strong>
            {formatDate(opptak.soknadsfrist)} - {deadlineInfo.text}
          </div>
        )}

        <div className="info-grid">
          <div className="info-section">
            <h3>Grunnleggende informasjon</h3>
            <div className="info-grid-content">
              <div className="info-item">
                <label>Navn:</label>
                <span>{opptak.navn}</span>
              </div>
              <div className="info-item">
                <label>Type:</label>
                <span>{opptak.opptakstype}</span>
              </div>
              <div className="info-item">
                <label>Institusjon:</label>
                <span>{institusjonInfo.navn} ({institusjonInfo.type})</span>
              </div>
              <div className="info-item">
                <label>Periode:</label>
                <span>{opptak.semester} {opptak.aar}</span>
              </div>
              {opptak.opptaksomgang && (
                <div className="info-item">
                  <label>Omgang:</label>
                  <span>{opptak.opptaksomgang}</span>
                </div>
              )}
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-text ${getStatusColor(opptak.status)}`}>
                  {opptak.status}
                </span>
              </div>
              <div className="info-item">
                <label>Aktiv:</label>
                <span className={opptak.aktiv ? 'active-text' : 'inactive-text'}>
                  {opptak.aktiv ? 'Ja' : 'Nei'}
                </span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Viktige datoer</h3>
            <div className="info-grid-content">
              <div className="info-item">
                <label>Søknadsfrist:</label>
                <span className="date-info">
                  {formatDate(opptak.soknadsfrist)}
                  {deadlineInfo && (
                    <small className={`deadline-note ${deadlineInfo.className}`}>
                      ({deadlineInfo.text})
                    </small>
                  )}
                </span>
              </div>
              {opptak.svarselskapsfrist && (
                <div className="info-item">
                  <label>Svarselskapsfrist:</label>
                  <span>{formatDate(opptak.svarselskapsfrist)}</span>
                </div>
              )}
              {opptak.studieopptaksfrist && (
                <div className="info-item">
                  <label>Studieopptaksfrist:</label>
                  <span>{formatDate(opptak.studieopptaksfrist)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Opptaksregler</h3>
            <div className="info-grid-content">
              {opptak.maxSoknaderPerPerson && (
                <div className="info-item">
                  <label>Maks søknader per person:</label>
                  <span>{opptak.maxSoknaderPerPerson}</span>
                </div>
              )}
              {opptak.eksternUrl && (
                <div className="info-item">
                  <label>Ekstern lenke:</label>
                  <span>
                    <a 
                      href={opptak.eksternUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      {opptak.eksternUrl}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Systeminfo</h3>
            <div className="info-grid-content">
              <div className="info-item">
                <label>ID:</label>
                <span className="id-text">{opptak.id}</span>
              </div>
              <div className="info-item">
                <label>Opprettet:</label>
                <span>{formatDateTime(opptak.opprettetTidspunkt)}</span>
              </div>
              <div className="info-item">
                <label>Sist oppdatert:</label>
                <span>{formatDateTime(opptak.oppdatertTidspunkt)}</span>
              </div>
            </div>
          </div>
        </div>

        {opptak.beskrivelse && (
          <div className="beskrivelse-section">
            <h3>Beskrivelse</h3>
            <div className="beskrivelse-content">
              {opptak.beskrivelse}
            </div>
          </div>
        )}

        {opptak.opptakInfo && (
          <div className="opptak-info-section">
            <h3>Opptaksinformasjon</h3>
            <div className="opptak-info-content">
              {opptak.opptakInfo}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpptakDetaljer;