import React from 'react';

const PersonDetaljer = ({ person, onTilbake, onRediger, onSlett }) => {
  if (!person) {
    return <div>Ingen person valgt</div>;
  }

  const handleSlett = () => {
    if (window.confirm(`Er du sikker på at du vil slette "${person.fornavn} ${person.etternavn}"?`)) {
      onSlett(person.id);
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

  const formatSimpleDato = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('nb-NO');
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

  const getFulltNavn = () => {
    const parts = [person.fornavn];
    if (person.mellomnavn) parts.push(person.mellomnavn);
    parts.push(person.etternavn);
    return parts.join(' ');
  };

  return (
    <div className="person-detaljer">
      <div className="detaljer-header">
        <button onClick={onTilbake} className="btn btn-secondary">
          ← Tilbake til liste
        </button>
        <div className="header-actions">
          <button onClick={() => onRediger(person)} className="btn btn-outline">
            Rediger
          </button>
          <button onClick={handleSlett} className="btn btn-danger">
            Slett
          </button>
        </div>
      </div>

      <div className="person-info">
        <div className="info-header">
          <h1>{getFulltNavn()}</h1>
          {person.fodselsdato && (
            <span className="age-badge large">{beregnAlder(person.fodselsdato)} år</span>
          )}
        </div>

        <div className="info-grid">
          <div className="info-section">
            <h3>Personopplysninger</h3>
            <div className="info-item">
              <label>Fornavn:</label>
              <span>{person.fornavn}</span>
            </div>
            {person.mellomnavn && (
              <div className="info-item">
                <label>Mellomnavn:</label>
                <span>{person.mellomnavn}</span>
              </div>
            )}
            <div className="info-item">
              <label>Etternavn:</label>
              <span>{person.etternavn}</span>
            </div>
            {person.fodselsnummer && (
              <div className="info-item">
                <label>Fødselsnummer:</label>
                <span className="sensitive-data">{person.fodselsnummer}</span>
              </div>
            )}
            {person.fodselsdato && (
              <div className="info-item">
                <label>Fødselsdato:</label>
                <span>{formatSimpleDato(person.fodselsdato)} ({beregnAlder(person.fodselsdato)} år)</span>
              </div>
            )}
            {person.statsborgerskap && (
              <div className="info-item">
                <label>Statsborgerskap:</label>
                <span>{person.statsborgerskap}</span>
              </div>
            )}
          </div>

          {(person.epost || person.telefon) && (
            <div className="info-section">
              <h3>Kontaktinformasjon</h3>
              {person.epost && (
                <div className="info-item">
                  <label>E-post:</label>
                  <span>
                    <a href={`mailto:${person.epost}`}>{person.epost}</a>
                  </span>
                </div>
              )}
              {person.telefon && (
                <div className="info-item">
                  <label>Telefon:</label>
                  <span>
                    <a href={`tel:${person.telefon}`}>{person.telefon}</a>
                  </span>
                </div>
              )}
            </div>
          )}

          {(person.adresse || person.postnummer || person.poststed) && (
            <div className="info-section">
              <h3>Adresse</h3>
              {person.adresse && (
                <div className="info-item">
                  <label>Adresse:</label>
                  <span>{person.adresse}</span>
                </div>
              )}
              {(person.postnummer || person.poststed) && (
                <div className="info-item">
                  <label>Poststed:</label>
                  <span>
                    {person.postnummer && `${person.postnummer} `}
                    {person.poststed}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="info-section">
            <h3>Metadata</h3>
            <div className="info-item">
              <label>Opprettet:</label>
              <span>{formatDato(person.opprettetTidspunkt)}</span>
            </div>
            <div className="info-item">
              <label>Sist oppdatert:</label>
              <span>{formatDato(person.oppdatertTidspunkt)}</span>
            </div>
            <div className="info-item">
              <label>ID:</label>
              <span className="id-text">{person.id}</span>
            </div>
          </div>
        </div>

        {/* TODO: Legg til seksjoner for søknader og dokumentasjon når de er implementert */}
        <div className="relaterte-data">
          <div className="info-section">
            <h3>Relaterte data</h3>
            <div className="info-item">
              <label>Søknader:</label>
              <span className="placeholder-text">Ikke implementert ennå</span>
            </div>
            <div className="info-item">
              <label>Dokumentasjon:</label>
              <span className="placeholder-text">Ikke implementert ennå</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetaljer;