import React, { useState } from 'react';
import InstitusjonListe from '../components/institusjon/InstitusjonListe.jsx';
import InstitusjonDetaljer from '../components/institusjon/InstitusjonDetaljer.jsx';
import InstitusjonSkjema from '../components/institusjon/InstitusjonSkjema.jsx';
import institusjonService from '../services/institusjonService.js';

const InstitusjonPage = () => {
  const [currentView, setCurrentView] = useState('liste'); // 'liste', 'detaljer', 'ny', 'rediger'
  const [selectedInstitusjon, setSelectedInstitusjon] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectInstitusjon = (institusjon) => {
    setSelectedInstitusjon(institusjon);
    setCurrentView('detaljer');
  };

  const handleNyInstitusjon = () => {
    setSelectedInstitusjon(null);
    setCurrentView('ny');
  };

  const handleRedigerInstitusjon = (institusjon) => {
    setSelectedInstitusjon(institusjon);
    setCurrentView('rediger');
  };

  const handleLagreInstitusjon = (institusjon) => {
    setCurrentView('detaljer');
    setSelectedInstitusjon(institusjon);
    triggerRefresh();
  };

  const handleAvbrytSkjema = () => {
    if (selectedInstitusjon && currentView === 'rediger') {
      setCurrentView('detaljer');
    } else {
      setCurrentView('liste');
      setSelectedInstitusjon(null);
    }
  };

  const handleTilbakeTilListe = () => {
    setCurrentView('liste');
    setSelectedInstitusjon(null);
  };

  const handleSlettInstitusjon = async (id) => {
    try {
      await institusjonService.slettInstitusjon(id);
      setCurrentView('liste');
      setSelectedInstitusjon(null);
      triggerRefresh();
    } catch (err) {
      alert('Kunne ikke slette institusjon');
      console.error('Error deleting institusjon:', err);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'liste':
        return (
          <InstitusjonListe
            key={refreshTrigger}
            onSelectInstitusjon={handleSelectInstitusjon}
            onNyInstitusjon={handleNyInstitusjon}
            onRedigerInstitusjon={handleRedigerInstitusjon}
          />
        );
      
      case 'detaljer':
        return (
          <InstitusjonDetaljer
            institusjon={selectedInstitusjon}
            onTilbake={handleTilbakeTilListe}
            onRediger={handleRedigerInstitusjon}
            onSlett={handleSlettInstitusjon}
          />
        );
      
      case 'ny':
        return (
          <InstitusjonSkjema
            mode="create"
            onLagre={handleLagreInstitusjon}
            onAvbryt={handleAvbrytSkjema}
          />
        );
      
      case 'rediger':
        return (
          <InstitusjonSkjema
            institusjon={selectedInstitusjon}
            mode="edit"
            onLagre={handleLagreInstitusjon}
            onAvbryt={handleAvbrytSkjema}
          />
        );
      
      default:
        return <div>Ukjent visning</div>;
    }
  };

  return (
    <div className="institusjon-page">
      {renderContent()}
    </div>
  );
};

export default InstitusjonPage;