import React, { useState } from 'react';
import OpptakListe from '../components/opptak/OpptakListe.jsx';
import OpptakSkjema from '../components/opptak/OpptakSkjema.jsx';
import OpptakDetaljer from '../components/opptak/OpptakDetaljer.jsx';

const OpptakPage = () => {
  const [currentView, setCurrentView] = useState('liste');
  const [selectedOpptak, setSelectedOpptak] = useState(null);

  const handleSelectOpptak = (opptak) => {
    setSelectedOpptak(opptak);
    setCurrentView('detaljer');
  };

  const handleNyOpptak = () => {
    setSelectedOpptak(null);
    setCurrentView('skjema');
  };

  const handleRedigerOpptak = (opptak) => {
    setSelectedOpptak(opptak);
    setCurrentView('skjema');
  };

  const handleLagre = (opptak) => {
    setSelectedOpptak(opptak);
    setCurrentView('detaljer');
  };

  const handleAvbryt = () => {
    setSelectedOpptak(null);
    setCurrentView('liste');
  };

  const handleTilbake = () => {
    setCurrentView('liste');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'liste':
        return (
          <OpptakListe
            onSelectOpptak={handleSelectOpptak}
            onNyOpptak={handleNyOpptak}
            onRedigerOpptak={handleRedigerOpptak}
          />
        );
      case 'skjema':
        return (
          <OpptakSkjema
            opptak={selectedOpptak}
            onLagre={handleLagre}
            onAvbryt={handleAvbryt}
          />
        );
      case 'detaljer':
        return (
          <OpptakDetaljer
            opptak={selectedOpptak}
            onTilbake={handleTilbake}
            onRediger={handleRedigerOpptak}
          />
        );
      default:
        return <div>Ukjent visning</div>;
    }
  };

  return (
    <div className="opptak-page">
      {renderCurrentView()}
    </div>
  );
};

export default OpptakPage;