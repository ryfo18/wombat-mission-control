import React, { useState, useEffect } from 'react';
import api from '../api';

const ARCHETYPE_STYLES = {
  Dominator:  'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
  'PD Play':  'bg-green-900/50 text-green-300 border border-green-700',
  Value:      'bg-blue-900/50 text-blue-300 border border-blue-700',
  Balanced:   'bg-slate-700/50 text-slate-300 border border-slate-600',
};

function LineupTable({ drivers, type }) {
  const totalSalary = drivers.reduce((s, d) => s + (d.dk_salary || 0), 0);
  const totalProj   = drivers.reduce((s, d) => s + (d.proj_pts || 0), 0);

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-slate-800">
      <div className={`px-5 py-3 flex items-center justify-between ${type === 'cash' ? 'bg-emerald-900/40 border-b border-emerald-800' : 'bg-purple-900/40 border-b border-purple-800'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{type === 'cash' ? '💰' : '🎯'}</span>
          <span className="font-bold text-white text-lg">{type === 'cash' ? 'Cash Lineup' : 'GPP Lineup'}</span>
          <span className="text-xs text-gray-400 ml-1">{type === 'cash' ? '(50/50 & H2H)' : '(Single-Entry)'}</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className={`font-mono font-bold ${totalSalary > 50000 ? 'text-red-400' : totalSalary > 49000 ? 'text-emerald-400' : 'text-yellow-400'}`}>
            ${totalSalary.toLocaleString()} / $50,000
          </span>
          <span className="text-gray-400">~{totalProj.toFixed(0)} proj pts</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2 text-left">Driver</th>
              <th className="px-4 py-2 text-right">Salary</th>
              <th className="px-4 py-2 text-right">Proj</th>
              <th className="px-4 py-2 text-right">Ceil</th>
              <th className="px-4 py-2 text-right">Own%</th>
              <th className="px-4 py-2 text-center">Start</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/40 transition">
                <td className="px-4 py-3 text-white font-semibold">{d.driver}</td>
                <td className="px-4 py-3 text-right text-emerald-400 font-mono">
                  {d.dk_salary ? `$${d.dk_salary.toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3 text-right text-blue-300">{d.proj_pts?.toFixed(1) ?? '—'}</td>
                <td className="px-4 py-3 text-right text-purple-300">{d.ceiling?.toFixed(1) ?? '—'}</td>
                <td className="px-4 py-3 text-right text-gray-300">{d.ownership != null ? `${d.ownership}%` : '—'}</td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {d.start_pos ? `P${d.start_pos}` : '—'}
                </td>
                <td className="px-4 py-3">
                  {d.archetype && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ARCHETYPE_STYLES[d.archetype] || ARCHETYPE_STYLES.Balanced}`}>
                      {d.archetype}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs max-w-xs">{d.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ race }) {
  return (
    <div className="bg-gray-900 border border-dashed border-slate-700 rounded-xl p-10 text-center">
      <div className="text-4xl mb-3">📋</div>
      <p className="text-gray-400 text-lg">No lineups yet for {race?.race_name || 'the upcoming race'}.</p>
      <p className="text-gray-600 text-sm mt-1">Wombat will post lineups by Sunday morning (or Saturday if Saturday race).</p>
    </div>
  );
}

export default function NASCARLineups() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getNascarLineups()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load lineups'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading lineups...</div>;
  if (error)   return <div className="text-red-400">{error}</div>;

  const meta = data?.meta;
  const hasCash = data?.cash?.length > 0;
  const hasGpp  = data?.gpp?.length > 0;
  const hasAny  = hasCash || hasGpp;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">🏎️ DK Lineups</h1>
        {meta ? (
          <p className="text-gray-400 mt-1">
            {meta.race_name} · {meta.track} · {new Date(meta.race_date + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
            {meta.lock_time && <span className="ml-2 text-yellow-500">🔒 Lock: {meta.lock_time}</span>}
          </p>
        ) : (
          <p className="text-gray-500 mt-1">Upcoming race</p>
        )}
      </div>

      {!hasAny ? (
        <EmptyState race={meta} />
      ) : (
        <div className="space-y-6">
          {hasCash && <LineupTable drivers={data.cash} type="cash" />}
          {hasGpp  && <LineupTable drivers={data.gpp}  type="gpp"  />}
        </div>
      )}
    </div>
  );
}
