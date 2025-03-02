import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import Translation from './pages/Translation';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>PolyglotDesk</h1>
        </header>
        <main className="app-content">
          <Translation />
        </main>
      </div>
    </Provider>
  );
}

export default App;
