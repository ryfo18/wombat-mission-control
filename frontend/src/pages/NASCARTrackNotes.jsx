import React, { useState } from 'react';
import trackNotes from '../data/trackNotes.json';

const DFS_LEAN_COLORS = {
  dominator: 'bg-orange-900/40 text-orange-300 border border-orange-700',
  'place-differential': 'bg-blue-900/40 text-blue-300 border border-blue-700',
  mixed: 'bg-purple-900/40 text-purple-300 border border-purple-700',
};

function TrackCard({ track, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-5 text-left transition group w-full"
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{track.emoji}</span>
        <div>
          <div className="text-white font-semibold text-lg group-hover:text-indigo-300 transition">
            {track.name}
          </div>
          <div className="text-gray-400 text-sm mt-0.5">
            {track.nickname} · {track.length} · {track.surface} · {track.type.replace('-', ' ')}
          </div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DFS_LEAN_COLORS[track.dfsLean] || DFS_LEAN_COLORS.mixed}`}>
              {track.dfsLean === 'dominator' ? '🔥 Dominator track' : track.dfsLean === 'place-differential' ? '📈 PD track' : '⚖️ Mixed'}
            </span>
          </div>
        </div>
      </div>
      <span className="text-gray-600 group-hover:text-indigo-400 text-xl transition">→</span>
    </button>
  );
}

function TrackDetail({ track, onBack }) {
  const [tab, setTab] = useState('strategy');

  const tabs = [
    { id: 'strategy', label: '💰 DFS Strategy' },
    { id: 'patterns', label: '📊 Key Patterns' },
    { id: 'history', label: '🏆 Past Winners' },
    { id: 'drivers', label: '🏎️ Drivers' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition"
        >
          ← Back to all tracks
        </button>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{track.emoji}</span>
          <div>
            <h2 className="text-3xl font-bold text-white">{track.name}</h2>
            <p className="text-gray-400 mt-0.5">{track.nickname} · {track.length} · {track.surface} · {track.banking}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DFS_LEAN_COLORS[track.dfsLean] || DFS_LEAN_COLORS.mixed}`}>
                {track.dfsLean === 'dominator' ? '🔥 Dominator track' : track.dfsLean === 'place-differential' ? '📈 PD track' : '⚖️ Mixed'}
              </span>
              {track.comparable && track.comparable.length > 0 && (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  Similar to: {track.comparable.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* DFS Lean Summary */}
        <div className="mt-4 bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-300 text-sm leading-relaxed">{track.dfsLeanNote}</p>
        </div>
      </div>

      {/* Special Format Alerts */}
      {track.formatNotes && track.formatNotes.length > 0 && (
        <div className="mb-6 space-y-3">
          {track.formatNotes.map((fn, i) => (
            <div key={i} className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400 text-sm font-semibold">⚠️ {fn.year} Special Format — {fn.event}</span>
              </div>
              <p className="text-yellow-200 text-sm leading-relaxed">{fn.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Strategy */}
      {tab === 'strategy' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-green-400 font-semibold mb-3">💵 Cash Game Strategy</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{track.dfsStrategy.cash}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-purple-400 font-semibold mb-3">🎯 GPP / Tournament Strategy</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{track.dfsStrategy.gpp}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-blue-400 font-semibold mb-3">📈 Place Differential Notes</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{track.pdNotes}</p>
          </div>
          {track.fadeList && track.fadeList.length > 0 && (
            <div className="bg-slate-900 border border-red-900 rounded-xl p-5">
              <h3 className="text-red-400 font-semibold mb-3">🚫 Fade Targets</h3>
              <ul className="space-y-2">
                {track.fadeList.map((item, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab: Patterns */}
      {tab === 'patterns' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">📊 Track Patterns & Tendencies</h3>
          <ul className="space-y-3">
            {track.keyPatterns.map((p, i) => (
              <li key={i} className="text-slate-300 text-sm flex items-start gap-3">
                <span className="text-indigo-400 font-bold mt-0.5">{i + 1}.</span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab: History */}
      {tab === 'history' && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">🏆 Historical Winners</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2 pr-4">Year</th>
                  <th className="text-left py-2 pr-4">Winner</th>
                  <th className="text-left py-2 pr-4">Start</th>
                  <th className="text-left py-2 pr-4">Laps Led</th>
                  <th className="text-left py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {track.historicalWinners.map((w, i) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/40">
                    <td className="py-2 pr-4 text-slate-300 font-medium">{w.year}</td>
                    <td className="py-2 pr-4 text-white font-semibold">{w.winner}</td>
                    <td className="py-2 pr-4 text-slate-400">{w.startPos ?? '—'}</td>
                    <td className="py-2 pr-4 text-orange-300">{w.lapsLed ?? '—'}</td>
                    <td className="py-2 text-slate-400 text-xs">{w.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Drivers */}
      {tab === 'drivers' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">🏎️ Key Drivers to Watch</h3>
            <div className="space-y-3">
              {track.keyDriversToWatch.map((d, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                  <span className="text-indigo-400 text-lg">👤</span>
                  <div>
                    <div className="text-white font-medium text-sm">{d.driver}</div>
                    <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{d.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NASCARTrackNotes() {
  const [selected, setSelected] = useState(null);
  const tracks = trackNotes.tracks;
  const track = selected ? tracks.find(t => t.id === selected) : null;

  if (track) {
    return <TrackDetail track={track} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">🗺️ Track Notes</h1>
        <p className="text-gray-400 mt-1">DFS strategy, tendencies, and historical context by track.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        {tracks.map(t => (
          <TrackCard key={t.id} track={t} onClick={() => setSelected(t.id)} />
        ))}
      </div>
    </div>
  );
}
