import React, { useState, useEffect } from 'react';
import api from '../api';

const TRACK_TYPE_LABELS = {
  superspeedway: '🏁 Superspeedway',
  intermediate:  '⚡ Intermediate',
  short_track:   '🔧 Short Track',
  road_course:   '🌀 Road Course',
  plate:         '🍽️ Plate Track',
};

function Section({ title, emoji, children }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-5 py-3 bg-slate-800 border-b border-slate-700">
        <h2 className="font-bold text-white text-base">{emoji} {title}</h2>
      </div>
      <div className="px-5 py-4 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function DriverTiers({ json }) {
  let tiers;
  try { tiers = JSON.parse(json); } catch { return <p className="text-gray-400 text-sm">{json}</p>; }

  const TIER_STYLES = {
    1: { label: 'Tier 1 — Lock',        bg: 'border-yellow-700 bg-yellow-900/20',  badge: 'bg-yellow-700 text-yellow-100' },
    2: { label: 'Tier 2 — Strong Play', bg: 'border-blue-700 bg-blue-900/20',      badge: 'bg-blue-700 text-blue-100' },
    3: { label: 'Tier 3 — GPP Only',    bg: 'border-purple-700 bg-purple-900/20',  badge: 'bg-purple-700 text-purple-100' },
    4: { label: 'Tier 4 — Contrarian',  bg: 'border-green-700 bg-green-900/20',    badge: 'bg-green-700 text-green-100' },
    5: { label: 'Tier 5 — Avoid',       bg: 'border-gray-700 bg-gray-800/20',      badge: 'bg-gray-600 text-gray-300' },
  };

  return (
    <div className="space-y-4">
      {tiers.map(tier => {
        const s = TIER_STYLES[tier.tier] || TIER_STYLES[5];
        return (
          <div key={tier.tier} className={`rounded-lg border px-4 py-3 ${s.bg}`}>
            <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded mb-2 ${s.badge}`}>
              {s.label}
            </div>
            <div className="space-y-2">
              {tier.drivers.map(d => (
                <div key={d.name} className="flex items-start gap-3">
                  <div className="flex gap-2 items-center min-w-0 shrink-0">
                    <span className="text-white font-semibold text-sm">{d.name}</span>
                    {d.salary && <span className="text-emerald-400 font-mono text-xs">${d.salary.toLocaleString()}</span>}
                    {d.own != null && <span className="text-gray-500 text-xs">{d.own}% own</span>}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ race }) {
  return (
    <div className="bg-gray-900 border border-dashed border-slate-700 rounded-xl p-10 text-center">
      <div className="text-4xl mb-3">📰</div>
      <p className="text-gray-400 text-lg">Analysis not yet available for {race?.race_name || 'the upcoming race'}.</p>
      <p className="text-gray-600 text-sm mt-1">Check back Thursday–Friday as projections and practice data come in.</p>
    </div>
  );
}

export default function NASCARAnalysis() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    api.getNascarAnalysis()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load analysis'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading analysis...</div>;
  if (error)   return <div className="text-red-400">{error}</div>;

  const trackTypeLabel = TRACK_TYPE_LABELS[data?.track_type] || data?.track_type;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white">📰 Race Analysis</h1>
          {trackTypeLabel && (
            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full border border-slate-600">
              {trackTypeLabel}
            </span>
          )}
        </div>
        {data && (
          <p className="text-gray-400 text-sm">
            {data.race_name} · {data.track} ·{' '}
            {new Date(data.race_date + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
            {data.lock_time && <span className="ml-2 text-yellow-500">🔒 {data.lock_time}</span>}
            {data.updated_at && (
              <span className="ml-3 text-gray-600 text-xs">
                Updated {new Date(data.updated_at).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })}
              </span>
            )}
          </p>
        )}
      </div>

      {!data?.race_overview ? (
        <EmptyState race={data} />
      ) : (
        <div className="space-y-4 max-w-4xl">
          {data.race_overview     && <Section title="Race Overview"         emoji="🏁">{data.race_overview}</Section>}
          {data.track_notes       && <Section title="Track Notes & History"  emoji="📊">{data.track_notes}</Section>}
          {data.points_distribution && <Section title="Where Points Are Scored" emoji="💯">{data.points_distribution}</Section>}
          {data.dominator_analysis  && <Section title="Dominator Analysis"   emoji="⚡">{data.dominator_analysis}</Section>}
          {data.driver_tiers        && (
            <div className="bg-gray-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-5 py-3 bg-slate-800 border-b border-slate-700">
                <h2 className="font-bold text-white text-base">🏎️ Driver Tiers</h2>
              </div>
              <div className="px-5 py-4">
                <DriverTiers json={data.driver_tiers} />
              </div>
            </div>
          )}
          {data.strategy_notes    && <Section title="Lineup Strategy"       emoji="🧠">{data.strategy_notes}</Section>}
        </div>
      )}
    </div>
  );
}
