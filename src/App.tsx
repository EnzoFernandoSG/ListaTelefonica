import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CadastroContato from './pages/CadastroContato';
import PesquisaContato from './pages/PesquisaContato'; 

import './App.css'; 

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <Link to="/" className="nav-link">🏠 Cadastro</Link>
          <Link to="/pesquisa" className="nav-link">🔎 Pesquisa</Link>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CadastroContato />} />
            <Route path="/pesquisa" element={<PesquisaContato />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;