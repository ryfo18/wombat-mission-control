import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Calendar from './pages/Calendar';
import Kanban from './pages/Kanban';
import Research from './pages/Research';
import Scripture from './pages/Scripture';
import NASCARTracks from './pages/NASCARTracks';
import NASCARLineups from './pages/NASCARLineups';
import NASCARAnalysis from './pages/NASCARAnalysis';
import NASCAR from './pages/NASCAR';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/calendar" replace />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/research" element={<Research />} />
            <Route path="/scripture" element={<Scripture />} />
            <Route path="/nascar" element={<NASCARTracks />} />
            <Route path="/nascar/lineups" element={<NASCARLineups />} />
            <Route path="/nascar/analysis" element={<NASCARAnalysis />} />
            <Route path="/nascar/track/:track" element={<NASCAR />} />
            <Route path="*" element={<Navigate to="/calendar" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;