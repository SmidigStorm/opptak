import React from 'react';

const InstitusjonDetaljer = ({ institusjon, onTilbake, onRediger, onSlett }) => {
  if (!institusjon) {
    return <div>Ingen institusjon valgt</div>;
  }

  const handleSlett = () => {
    if (window.confirm(`Er du sikker på at du vil slette "${institusjon.institusjonsnavn}"?`)) {
      onSlett(institusjon.id);
    }
  };

  const formatDato = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="institusjon-detaljer">
      <div className="detaljer-header">
        <button onClick={onTilbake} className="btn btn-secondary">
          ← Tilbake til liste
        </button>
        <div className="header-actions">
          <button onClick={() => onRediger(institusjon)} className="btn btn-outline">
            Rediger
          </button>
          <button onClick={handleSlett} className="btn btn-danger">
            Slett
          </button>
        </div>
      </div>

      <div className="institusjon-info">
        <div className="info-header">
          <h1>{institusjon.institusjonsnavn}</h1>
          <span className="type-badge large">{institusjon.type}</span>
        </div>

        <div className="info-grid">
          <div className="info-section">
            <h3>Grunnleggende informasjon</h3>
            <div className="info-item">
              <label>Organisasjonsnummer:</label>
              <span>{institusjon.organisasjonsnummer}</span>
            </div>
            <div className="info-item">
              <label>Type:</label>
              <span>{institusjon.type}</span>
            </div>
          </div>

          {(institusjon.adresse || institusjon.postnummer || institusjon.poststed) && (
            <div className="info-section">
              <h3>Adresse</h3>
              {institusjon.adresse && (
                <div className="info-item">
                  <label>Adresse:</label>
                  <span>{institusjon.adresse}</span>
                </div>
              )}
              {(institusjon.postnummer || institusjon.poststed) && (
                <div className="info-item">
                  <label>Poststed:</label>
                  <span>
                    {institusjon.postnummer && `${institusjon.postnummer} `}
                    {institusjon.poststed}
                  </span>
                </div>
              )}
            </div>
          )}

          {(institusjon.epost || institusjon.telefon) && (
            <div className="info-section">
              <h3>Kontaktinformasjon</h3>
              {institusjon.epost && (
                <div className="info-item">
                  <label>E-post:</label>
                  <span>
                    <a href={`mailto:${institusjon.epost}`}>{institusjon.epost}</a>
                  </span>
                </div>
              )}
              {institusjon.telefon && (
                <div className="info-item">
                  <label>Telefon:</label>
                  <span>
                    <a href={`tel:${institusjon.telefon}`}>{institusjon.telefon}</a>
                  </span>
                </div>
              )}
            </div>
          )}

          {(institusjon.spesialiseringsomrade || institusjon.akkrediteringsstatus) && (
            <div className="info-section">
              <h3>Tilleggsinformasjon</h3>
              {institusjon.spesialiseringsomrade && (
                <div className="info-item">
                  <label>Spesialiseringsområde:</label>
                  <span>{institusjon.spesialiseringsomrade}</span>
                </div>
              )}
              {institusjon.akkrediteringsstatus && (
                <div className="info-item">
                  <label>Akkrediteringsstatus:</label>
                  <span className={`status ${institusjon.akkrediteringsstatus.toLowerCase().replace(' ', '-')}`}>
                    {institusjon.akkrediteringsstatus}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="info-section">
            <h3>Metadata</h3>
            <div className="info-item">
              <label>Opprettet:</label>
              <span>{formatDato(institusjon.opprettetTidspunkt)}</span>
            </div>
            <div className="info-item">
              <label>Sist oppdatert:</label>
              <span>{formatDato(institusjon.oppdatertTidspunkt)}</span>
            </div>
            <div className="info-item">
              <label>ID:</label>
              <span className="id-text">{institusjon.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitusjonDetaljer;