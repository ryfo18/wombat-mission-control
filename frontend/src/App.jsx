import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Calendar from './pages/Calendar';
import Kanban from './pages/Kanban';
import Research from './pages/Research';
import Scripture from './pages/Scripture';
import NASCAR from './pages/NASCAR';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 ml-[240px] p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/calendar" replace />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/research" element={<Research />} />
            <Route path="/scripture" element={<Scripture />} />
            <Route path="/nascar" element={<NASCAR />} />
            <Route path="*" element={<Navigate to="/calendar" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;