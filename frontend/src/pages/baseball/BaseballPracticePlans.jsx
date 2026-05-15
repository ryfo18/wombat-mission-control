import React from 'react';
import { Link, useParams } from 'react-router-dom';
import plansData from '../../data/practicePlans.json';

function PlanDetail({ plan }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{plan.title}</h2>
          <p className="text-slate-400 text-sm mt-1">
            {new Date(plan.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}{plan.durationMin} min practice
          </p>
        </div>
        <Link to="/baseball/practice-plans" className="text-sm text-indigo-400 hover:text-indigo-300 shrink-0">← All Plans</Link>
      </div>

      {/* Focus highlights */}
      {plan.focusAreas?.length > 0 && (
        <div className="bg-indigo-900/40 border border-indigo-700 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-300 mb-2">🎯 Today's Focus</h3>
          <div className="flex flex-wrap gap-2">
            {plan.focusAreas.map(f => (
              <span key={f} className="text-sm bg-indigo-700 text-indigo-100 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>
          {plan.notes && <p className="text-slate-400 text-sm mt-3">{plan.notes}</p>}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-200">📋 Practice Schedule</h3>
        {plan.blocks.map((block, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-slate-500">{block.timeLabel}</span>
                <h4 className="font-semibold text-white">{block.activity}</h4>
                <p className="text-sm text-slate-400 mt-0.5">{block.details}</p>
              </div>
              <span className="text-xs text-slate-500 shrink-0">{block.durationMin} min</span>
            </div>
            {block.drillLinks?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {block.drillLinks.map((link, j) => (
                  <a
                    key={j}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    🎬 {link.label}
                  </a>
                ))}
              </div>
            )}
            {block.coachingPoints?.length > 0 && (
              <ul className="list-disc list-inside text-xs text-slate-500 space-y-0.5 mt-1">
                {block.coachingPoints.map((pt, j) => <li key={j}>{pt}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>

      {plan.coachNotes && (
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-amber-500">
          <h3 className="font-semibold text-amber-400 mb-1">📝 Coach Notes</h3>
          <p className="text-sm text-slate-400">{plan.coachNotes}</p>
        </div>
      )}
    </div>
  );
}

function PlanList({ plans }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🗓️ Practice Plans</h2>
        <Link to="/baseball" className="text-sm text-indigo-400 hover:text-indigo-300">← Back</Link>
      </div>
      <p className="text-slate-400 text-sm">
        Practice plans generated from the drill catalog. Ask Wombat to generate a new one anytime.
      </p>
      {plans.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-500">
          <p className="text-lg mb-2">No plans yet.</p>
          <p className="text-sm">Tell Wombat your practice date, focus areas, and length — a plan will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...plans].sort((a, b) => b.date.localeCompare(a.date)).map(plan => (
            <Link
              key={plan.id}
              to={`/baseball/practice-plans/${plan.id}`}
              className="bg-slate-800 hover:bg-slate-750 rounded-lg p-5 flex flex-col gap-2 group border border-transparent hover:border-indigo-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-white group-hover:text-indigo-300">{plan.title}</h3>
                <span className="text-xs text-slate-500 shrink-0">{plan.durationMin} min</span>
              </div>
              <p className="text-xs text-slate-500">
                {new Date(plan.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              {plan.focusAreas?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {plan.focusAreas.map(f => (
                    <span key={f} className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              )}
              {plan.summary && <p className="text-sm text-slate-400">{plan.summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const BaseballPracticePlans = () => {
  const { id } = useParams();
  const plans = plansData.plans;

  if (id) {
    const plan = plans.find(p => p.id === id);
    if (!plan) return (
      <div className="text-center py-16 text-slate-500">
        <p>Plan not found.</p>
        <Link to="/baseball/practice-plans" className="text-indigo-400 hover:underline mt-2 block">← Back to plans</Link>
      </div>
    );
    return <PlanDetail plan={plan} />;
  }

  return <PlanList plans={plans} />;
};

export default BaseballPracticePlans;
