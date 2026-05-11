import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800">
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
          <NavLink
            to="/nascar"
            end
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            🏎️ NASCAR DK
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;