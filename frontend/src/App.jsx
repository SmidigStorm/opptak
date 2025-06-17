import { useState } from 'react'
import './App.css'
import InstitusjonPage from './pages/InstitusjonPage.jsx'
import PersonPage from './pages/PersonPage.jsx'
import UtdanningstilbudPage from './pages/UtdanningstilbudPage.jsx'
import OpptakPage from './pages/OpptakPage.jsx'

function App() {
  const [currentModule, setCurrentModule] = useState('institusjoner')

  const renderModule = () => {
    switch (currentModule) {
      case 'institusjoner':
        return <InstitusjonPage />
      case 'personer':
        return <PersonPage />
      case 'utdanningstilbud':
        return <UtdanningstilbudPage />
      case 'opptak':
        return <OpptakPage />
      default:
        return <div>Velg en modul</div>
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Opptakssystem</h1>
        <nav className="main-nav">
          <button 
            className={currentModule === 'institusjoner' ? 'active' : ''}
            onClick={() => setCurrentModule('institusjoner')}
          >
            Institusjoner
          </button>
          <button 
            className={currentModule === 'personer' ? 'active' : ''}
            onClick={() => setCurrentModule('personer')}
          >
            Personer
          </button>
          <button 
            className={currentModule === 'utdanningstilbud' ? 'active' : ''}
            onClick={() => setCurrentModule('utdanningstilbud')}
          >
            Utdanningstilbud
          </button>
          <button 
            className={currentModule === 'opptak' ? 'active' : ''}
            onClick={() => setCurrentModule('opptak')}
          >
            Opptak
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {renderModule()}
      </main>
    </div>
  )
}

export default App
