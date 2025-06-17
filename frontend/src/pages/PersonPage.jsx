import React, { useState } from 'react';
import PersonListe from '../components/person/PersonListe.jsx';
import PersonDetaljer from '../components/person/PersonDetaljer.jsx';
import PersonSkjema from '../components/person/PersonSkjema.jsx';
import personService from '../services/personService.js';

const PersonPage = () => {
  const [currentView, setCurrentView] = useState('liste'); // 'liste', 'detaljer', 'ny', 'rediger'
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setCurrentView('detaljer');
  };

  const handleNyPerson = () => {
    setSelectedPerson(null);
    setCurrentView('ny');
  };

  const handleRedigerPerson = (person) => {
    setSelectedPerson(person);
    setCurrentView('rediger');
  };

  const handleLagrePerson = (person) => {
    setCurrentView('detaljer');
    setSelectedPerson(person);
    triggerRefresh();
  };

  const handleAvbrytSkjema = () => {
    if (selectedPerson && currentView === 'rediger') {
      setCurrentView('detaljer');
    } else {
      setCurrentView('liste');
      setSelectedPerson(null);
    }
  };

  const handleTilbakeTilListe = () => {
    setCurrentView('liste');
    setSelectedPerson(null);
  };

  const handleSlettPerson = async (id) => {
    try {
      await personService.slettPerson(id);
      setCurrentView('liste');
      setSelectedPerson(null);
      triggerRefresh();
    } catch (err) {
      alert('Kunne ikke slette person');
      console.error('Error deleting person:', err);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'liste':
        return (
          <PersonListe
            key={refreshTrigger}
            onSelectPerson={handleSelectPerson}
            onNyPerson={handleNyPerson}
            onRedigerPerson={handleRedigerPerson}
          />
        );
      
      case 'detaljer':
        return (
          <PersonDetaljer
            person={selectedPerson}
            onTilbake={handleTilbakeTilListe}
            onRediger={handleRedigerPerson}
            onSlett={handleSlettPerson}
          />
        );
      
      case 'ny':
        return (
          <PersonSkjema
            mode="create"
            onLagre={handleLagrePerson}
            onAvbryt={handleAvbrytSkjema}
          />
        );
      
      case 'rediger':
        return (
          <PersonSkjema
            person={selectedPerson}
            mode="edit"
            onLagre={handleLagrePerson}
            onAvbryt={handleAvbrytSkjema}
          />
        );
      
      default:
        return <div>Ukjent visning</div>;
    }
  };

  return (
    <div className="person-page">
      {renderContent()}
    </div>
  );
};

export default PersonPage;