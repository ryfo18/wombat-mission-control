import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import catalog from '../../data/drillCatalog.json';

function TeamDrillCard({ drill }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800 rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base text-white">{drill.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{drill.description}</p>
        </div>
        <span className="text-xs text-slate-500 shrink-0">{drill.durationMin} min</span>
      </div>
      <button
        className="text-sm text-indigo-400 hover:text-indigo-300 text-left"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '▲ Hide details' : '▼ Show details'}
      </button>
      {open && (
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <span className="font-medium text-slate-200">Setup: </span>
            {drill.setup}
          </div>
          {drill.coachingPoints?.length > 0 && (
            <div>
              <span className="font-medium text-slate-200">Coaching Points:</span>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
                {drill.coachingPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>
          )}
          {drill.links?.length > 0 && (
            <div>
              <span className="font-medium text-slate-200">Links:</span>
              <ul className="mt-1 space-y-1">
                {drill.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      🎬 {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BaseballTeamDrills = () => {
  const teamDrills = catalog.drills.filter(d => d.category === 'team');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">👥 Team Drills</h2>
        <Link to="/baseball" className="text-sm text-indigo-400 hover:text-indigo-300">← Back</Link>
      </div>
      <p className="text-slate-400 text-sm">
        Full-team exercises covering cutoffs, relays, double plays, communication, and situational defense.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamDrills.map(d => <TeamDrillCard key={d.id} drill={d} />)}
      </div>
    </div>
  );
};

export default BaseballTeamDrills;
