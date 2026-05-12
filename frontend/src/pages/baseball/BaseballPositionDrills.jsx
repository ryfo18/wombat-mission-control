import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import catalog from '../../data/drillCatalog.json';

const CATEGORY_LABELS = {
  'warm-up': 'Warm-Up',
  'fielding': 'Fielding',
  'throwing': 'Throwing',
  'team': 'Team Drills',
};

const SUBCATEGORY_LABELS = {
  'warm-up': 'Warm-Up',
  'ground-balls': 'Ground Balls',
  'fly-balls': 'Fly Balls',
  'footwork': 'Footwork',
  'throwing': 'Throwing',
  'mechanics': 'Mechanics',
  'double-plays': 'Double Plays',
  'cutoffs-relays': 'Cutoffs & Relays',
  'communication': 'Communication',
  'situational': 'Situational Defense',
};

const PLAYER_LABELS = {
  'all': 'All Players',
  'infield': 'Infielders',
  'outfield': 'Outfielders',
  'first-base': '1B Only',
};

const FORMAT_LABELS = {
  'full-team': 'Full Team',
  'station': 'Station',
  'pairs': 'Pairs',
};

const TAG_COLORS = [
  'bg-indigo-700 text-indigo-200',
  'bg-slate-600 text-slate-200',
  'bg-emerald-800 text-emerald-200',
  'bg-amber-800 text-amber-200',
];

function DrillCard({ drill }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800 rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base text-white">{drill.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{drill.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
            {FORMAT_LABELS[drill.format] || drill.format}
          </span>
          <span className="text-xs text-slate-500">{drill.durationMin} min</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {drill.tags.slice(0, 5).map((tag, i) => (
          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}>
            {tag}
          </span>
        ))}
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
          {drill.equipment?.length > 0 && (
            <div>
              <span className="font-medium text-slate-200">Equipment: </span>
              <span className="text-slate-400">{drill.equipment.join(', ')}</span>
            </div>
          )}
          {drill.links?.length > 0 && (
            <div>
              <span className="font-medium text-slate-200">Links:</span>
              <ul className="mt-1 space-y-1">
                {drill.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
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

const BaseballPositionDrills = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPlayers, setFilterPlayers] = useState('all');
  const [search, setSearch] = useState('');

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];
  const playerGroups = ['all', ...Object.keys(PLAYER_LABELS)];

  const filtered = catalog.drills.filter(d => {
    if (filterCategory !== 'all' && d.category !== filterCategory) return false;
    if (filterPlayers !== 'all' && d.players !== filterPlayers && d.players !== 'all') return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.tags.join(' ').includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🧤 Drill Catalog</h2>
        <Link to="/baseball" className="text-sm text-indigo-400 hover:text-indigo-300">← Back</Link>
      </div>
      <p className="text-slate-400 text-sm">
        Browse all drills. Use filters to narrow by type or group.
        Drills are linked to YouTube videos and include coaching points.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search drills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded bg-slate-700 text-slate-200 text-sm border border-slate-600 focus:outline-none focus:border-indigo-500 w-48"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded text-sm ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {cat === 'all' ? 'All Categories' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {playerGroups.map(pg => (
            <button
              key={pg}
              onClick={() => setFilterPlayers(pg)}
              className={`px-3 py-1.5 rounded text-sm ${filterPlayers === pg ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {pg === 'all' ? 'All Players' : PLAYER_LABELS[pg]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">{filtered.length} drill{filtered.length !== 1 ? 's' : ''} shown</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(drill => <DrillCard key={drill.id} drill={drill} />)}
        {filtered.length === 0 && (
          <p className="text-slate-500 col-span-2 text-center py-8">No drills match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default BaseballPositionDrills;
