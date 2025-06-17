import React, { useState } from 'react';
import UtdanningstilbudListe from '../components/utdanningstilbud/UtdanningstilbudListe.jsx';
import UtdanningstilbudDetaljer from '../components/utdanningstilbud/UtdanningstilbudDetaljer.jsx';
import UtdanningstilbudSkjema from '../components/utdanningstilbud/UtdanningstilbudSkjema.jsx';
import utdanningstilbudService from '../services/utdanningstilbudService.js';

const UtdanningstilbudPage = () => {
  const [currentView, setCurrentView] = useState('liste'); // 'liste', 'detaljer', 'ny', 'rediger'
  const [selectedUtdanningstilbud, setSelectedUtdanningstilbud] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectUtdanningstilbud = (utdanningstilbud) => {
    setSelectedUtdanningstilbud(utdanningstilbud);
    setCurrentView('detaljer');
  };

  const handleNyUtdanningstilbud = () => {
    setSelectedUtdanningstilbud(null);
    setCurrentView('ny');
  };

  const handleRedigerUtdanningstilbud = (utdanningstilbud) => {
    setSelectedUtdanningstilbud(utdanningstilbud);
    setCurrentView('rediger');
  };

  const handleLagre = (utdanningstilbud) => {
    setCurrentView('detaljer');
    setSelectedUtdanningstilbud(utdanningstilbud);
    triggerRefresh();
  };

  const handleAvbrytSkjema = () => {
    if (selectedUtdanningstilbud && currentView === 'rediger') {
      setCurrentView('detaljer');
    } else {
      setCurrentView('liste');
      setSelectedUtdanningstilbud(null);
    }
  };

  const handleTilbakeTilListe = () => {
    setCurrentView('liste');
    setSelectedUtdanningstilbud(null);
  };

  const handleSlettUtdanningstilbud = async (id) => {
    try {
      await utdanningstilbudService.slettUtdanningstilbud(id);
      setCurrentView('liste');
      setSelectedUtdanningstilbud(null);
      triggerRefresh();
    } catch (err) {
      alert('Kunne ikke slette utdanningstilbud');
      console.error('Error deleting utdanningstilbud:', err);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'liste':
        return (
          <UtdanningstilbudListe
            key={refreshTrigger}
            onSelectUtdanningstilbud={handleSelectUtdanningstilbud}
            onNyUtdanningstilbud={handleNyUtdanningstilbud}
            onRedigerUtdanningstilbud={handleRedigerUtdanningstilbud}
          />
        );
      
      case 'detaljer':
        return (
          <UtdanningstilbudDetaljer
            utdanningstilbud={selectedUtdanningstilbud}
            onTilbake={handleTilbakeTilListe}
            onRediger={handleRedigerUtdanningstilbud}
            onSlett={handleSlettUtdanningstilbud}
          />
        );
      
      case 'ny':
        return (
          <UtdanningstilbudSkjema
            mode="create"
            onLagre={handleLagre}
            onAvbryt={handleAvbrytSkjema}
          />
        );
      
      case 'rediger':
        return (
          <UtdanningstilbudSkjema
            utdanningstilbud={selectedUtdanningstilbud}
            mode="edit"
            onLagre={handleLagre}
            onAvbryt={handleAvbrytSkjema}
          />
        );
      
      default:
        return <div>Ukjent visning</div>;
    }
  };

  return (
    <div className="utdanningstilbud-page">
      {renderContent()}
    </div>
  );
};

export default UtdanningstilbudPage;