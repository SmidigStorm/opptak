import React from 'react';

const UtdanningstilbudDetaljer = ({ utdanningstilbud, onTilbake, onRediger, onSlett }) => {
  if (!utdanningstilbud) {
    return <div>Ingen utdanningstilbud valgt</div>;
  }

  const handleSlett = () => {
    if (window.confirm(`Er du sikker på at du vil slette "${utdanningstilbud.navn}"?`)) {
      onSlett(utdanningstilbud.id);
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

  const formatVarighet = (semestre) => {
    const år = Math.floor(semestre / 2);
    const restSemestre = semestre % 2;
    
    if (år === 0) {
      return `${semestre} semester`;
    } else if (restSemestre === 0) {
      return `${år} år (${semestre} semestre)`;
    } else {
      return `${år},5 år (${semestre} semestre)`;
    }
  };

  const formatStudiepoeng = (studiepoeng) => {
    return `${studiepoeng} studiepoeng`;
  };

  const formatStudieavgift = (studieavgift) => {
    if (!studieavgift || studieavgift === 0) {
      return 'Gratis';
    }
    return `${studieavgift.toLocaleString('nb-NO')} NOK per år`;
  };

  return (
    <div className="utdanningstilbud-detaljer">
      <div className="detaljer-header">
        <button onClick={onTilbake} className="btn btn-secondary">
          ← Tilbake til liste
        </button>
        <div className="header-actions">
          <button onClick={() => onRediger(utdanningstilbud)} className="btn btn-outline">
            Rediger
          </button>
          <button onClick={handleSlett} className="btn btn-danger">
            Slett
          </button>
        </div>
      </div>

      <div className="utdanningstilbud-info">
        <div className="info-header">
          <h1>{utdanningstilbud.navn}</h1>
          <div className="header-badges">
            <span className="badge level-badge">{utdanningstilbud.utdanningsnivaa}</span>
            <span className={`badge status-badge ${utdanningstilbud.aktiv ? 'active' : 'inactive'}`}>
              {utdanningstilbud.aktiv ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-section">
            <h3>Grunnleggende informasjon</h3>
            <div className="info-item">
              <label>Navn:</label>
              <span>{utdanningstilbud.navn}</span>
            </div>
            <div className="info-item">
              <label>Utdanningsnivå:</label>
              <span>{utdanningstilbud.utdanningsnivaa}</span>
            </div>
            <div className="info-item">
              <label>Fagområde:</label>
              <span>{utdanningstilbud.fagomraade}</span>
            </div>
            <div className="info-item">
              <label>Institusjon:</label>
              <span>{utdanningstilbud.institusjon?.institusjonsnavn || 'Ukjent'}</span>
            </div>
            {utdanningstilbud.beskrivelse && (
              <div className="info-item">
                <label>Beskrivelse:</label>
                <span className="beskrivelse-text">{utdanningstilbud.beskrivelse}</span>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>Studiedetaljer</h3>
            <div className="info-item">
              <label>Varighet:</label>
              <span>{formatVarighet(utdanningstilbud.varighetSemestre)}</span>
            </div>
            <div className="info-item">
              <label>Studiepoeng:</label>
              <span>{formatStudiepoeng(utdanningstilbud.studiepoeng)}</span>
            </div>
            {utdanningstilbud.undervisningsspråk && (
              <div className="info-item">
                <label>Undervisningsspråk:</label>
                <span>{utdanningstilbud.undervisningsspråk}</span>
              </div>
            )}
            {utdanningstilbud.oppstartssemestre && (
              <div className="info-item">
                <label>Oppstartssemestre:</label>
                <span>{utdanningstilbud.oppstartssemestre}</span>
              </div>
            )}
            {utdanningstilbud.studieavgift !== null && utdanningstilbud.studieavgift !== undefined && (
              <div className="info-item">
                <label>Studieavgift:</label>
                <span>{formatStudieavgift(utdanningstilbud.studieavgift)}</span>
              </div>
            )}
            {utdanningstilbud.kapasitet && (
              <div className="info-item">
                <label>Kapasitet:</label>
                <span>{utdanningstilbud.kapasitet} studenter per år</span>
              </div>
            )}
          </div>

          {utdanningstilbud.opptakskrav && (
            <div className="info-section">
              <h3>Opptakskrav</h3>
              <div className="info-item">
                <span className="opptakskrav-text">{utdanningstilbud.opptakskrav}</span>
              </div>
            </div>
          )}

          <div className="info-section">
            <h3>Institusjonsinformasjon</h3>
            {utdanningstilbud.institusjon && (
              <>
                <div className="info-item">
                  <label>Institusjonsnavn:</label>
                  <span>{utdanningstilbud.institusjon.institusjonsnavn}</span>
                </div>
                <div className="info-item">
                  <label>Institusjonstype:</label>
                  <span>{utdanningstilbud.institusjon.type}</span>
                </div>
                {utdanningstilbud.institusjon.poststed && (
                  <div className="info-item">
                    <label>Sted:</label>
                    <span>{utdanningstilbud.institusjon.poststed}</span>
                  </div>
                )}
                {utdanningstilbud.institusjon.epost && (
                  <div className="info-item">
                    <label>E-post:</label>
                    <span>
                      <a href={`mailto:${utdanningstilbud.institusjon.epost}`}>
                        {utdanningstilbud.institusjon.epost}
                      </a>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="info-section">
            <h3>Metadata</h3>
            <div className="info-item">
              <label>Status:</label>
              <span className={utdanningstilbud.aktiv ? 'status-active' : 'status-inactive'}>
                {utdanningstilbud.aktiv ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            <div className="info-item">
              <label>Opprettet:</label>
              <span>{formatDato(utdanningstilbud.opprettetTidspunkt)}</span>
            </div>
            <div className="info-item">
              <label>Sist oppdatert:</label>
              <span>{formatDato(utdanningstilbud.oppdatertTidspunkt)}</span>
            </div>
            <div className="info-item">
              <label>ID:</label>
              <span className="id-text">{utdanningstilbud.id}</span>
            </div>
          </div>
        </div>

        {/* TODO: Legg til seksjoner for søknader og statistikk når de er implementert */}
        <div className="relaterte-data">
          <div className="info-section">
            <h3>Relaterte data</h3>
            <div className="info-item">
              <label>Søknader:</label>
              <span className="placeholder-text">Ikke implementert ennå</span>
            </div>
            <div className="info-item">
              <label>Statistikk:</label>
              <span className="placeholder-text">Ikke implementert ennå</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtdanningstilbudDetaljer;