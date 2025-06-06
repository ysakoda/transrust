// src/App.tsx
import { Provider } from 'react-redux';
import { useState } from 'react';
import store from './store';
import './App.css';
import Translation from './pages/Translation';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  const [activeTab, setActiveTab] = useState<'translation' | 'history' | 'settings'>('translation');

  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>PolyglotDesk</h1>
          <nav className="app-nav">
            <button
              className={`nav-button ${activeTab === 'translation' ? 'active' : ''}`}
              onClick={() => setActiveTab('translation')}
            >
              翻訳
            </button>
            <button
              className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              履歴
            </button>
            <button
              className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              設定
            </button>
          </nav>
        </header>
        <main className="app-content">
          {activeTab === 'translation' ? (
            <Translation />
          ) : activeTab === 'history' ? (
            <History />
          ) : (
            <Settings />
          )}
        </main>
      </div>
    </Provider>
  );
}

export default App;
