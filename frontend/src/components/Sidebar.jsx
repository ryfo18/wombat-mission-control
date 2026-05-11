import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const onNascar = location.pathname.startsWith('/nascar');
  const [nascarOpen, setNascarOpen] = useState(onNascar);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-100 mb-8">
          Wombat Mission Control 📋
        </h1>
        <nav className="space-y-2">
          <NavLink
            to="/calendar"
            end
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            📅 Calendar
          </NavLink>
          <NavLink
            to="/kanban"
            end
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            ✅ Tasks
          </NavLink>
          <NavLink
            to="/research"
            end
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            🔬 Research
          </NavLink>
          <NavLink
            to="/scripture"
            end
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            📖 Scripture
          </NavLink>
          {/* NASCAR DK with dropdown */}
          <div>
            <button
              onClick={() => setNascarOpen(o => !o)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                onNascar ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🏎️ NASCAR DK</span>
              <span className="text-xs">{nascarOpen ? '▾' : '▸'}</span>
            </button>
            {nascarOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <NavLink
                  to="/nascar/lineups"
                  className={() =>
                    `block px-3 py-1.5 rounded-md text-xs font-medium ${
                      location.pathname === '/nascar/lineups'
                        ? 'text-indigo-300 bg-indigo-900/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  💰 Lineups
                </NavLink>
                <NavLink
                  to="/nascar/analysis"
                  className={() =>
                    `block px-3 py-1.5 rounded-md text-xs font-medium ${
                      location.pathname === '/nascar/analysis'
                        ? 'text-indigo-300 bg-indigo-900/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  📰 Analysis
                </NavLink>
                <NavLink
                  to="/nascar"
                  className={() =>
                    `block px-3 py-1.5 rounded-md text-xs font-medium ${
                      location.pathname === '/nascar'
                        ? 'text-indigo-300 bg-indigo-900/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  📊 Track History
                </NavLink>
                <NavLink
                  to="/nascar?view=trends"
                  className={() =>
                    `block px-3 py-1.5 rounded-md text-xs font-medium ${
                      location.pathname.startsWith('/nascar') && location.search.includes('view=trends')
                        ? 'text-indigo-300 bg-indigo-900/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  📈 Driver Trends
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;