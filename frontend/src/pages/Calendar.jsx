import React, { useEffect, useState } from 'react';
import api from '../api';

const CALENDAR_COLORS = {
  "Family Stuff": "border-green-500",
  "SC Wave 2015 Girls Pre-GA": "border-purple-500",
  "Merton Mavericks Blue 12U": "border-orange-500",
  "Merton Fillies 8U": "border-yellow-500",
  "Merton Fillies U10 Blue": "border-blue-400",
  "US Holidays": "border-slate-500",
};

const TZ = 'America/Chicago';

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleString('en-US', {
      timeZone: TZ,
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function groupByDate(events) {
  const groups = {};
  events.forEach(e => {
    const key = (e.start || '').slice(0, 10);
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return groups;
}

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [carpool, setCarpool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carpoolLoading, setCarpoolLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(14);

  const loadData = async () => {
    setLoading(true);
    setCarpoolLoading(true);
    setError(null);
    try {
      const [eventsRes, carpoolRes] = await Promise.all([
        api.getCalendarEvents(days),
        api.getCarpoolRecommendation(days),
      ]);
      setEvents(eventsRes.data.events || []);
      setCarpool(carpoolRes.data);
    } catch (err) {
      setError('Failed to load calendar data. Make sure the backend is running.');
    } finally {
      setLoading(false);
      setCarpoolLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [days]);

  const grouped = groupByDate(events);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-3">
          <label className="text-slate-400 text-sm">Show next</label>
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
          <button
            onClick={loadData}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Carpool Section */}
      <div className="bg-slate-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          🚗 Carpool Recommendations
        </h3>
        {carpoolLoading ? (
          <p className="text-slate-400 text-sm">Analyzing schedule...</p>
        ) : carpool ? (
          <div>
            <p className="text-slate-300 mb-3">{carpool.message}</p>
            {carpool.conflicts && carpool.conflicts.length > 0 && (
              <div className="space-y-3">
                {carpool.conflicts.map((conflict, i) => (
                  <div key={i} className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
                    <p className="font-semibold text-yellow-300 mb-1">
                      ⚠️ {formatDate(conflict.date)}
                    </p>
                    <p className="text-slate-400 text-sm mb-2">{conflict.note}</p>
                    <ul className="space-y-1">
                      {conflict.events.map((ev, j) => (
                        <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">•</span>{ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No data available.</p>
        )}
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(CALENDAR_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className={`w-3 h-3 rounded-sm border-l-4 bg-slate-700 ${color}`} />
            {name}
          </div>
        ))}
      </div>

      {/* Events by Day */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-slate-400">Loading events...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center text-slate-500 py-12">No events in this period.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date}>
              <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-2">
                {formatDate(date)}
              </h4>
              <div className="space-y-2">
                {dayEvents.map(event => {
                  const borderColor = CALENDAR_COLORS[event.calendar] || 'border-slate-500';
                  return (
                    <div
                      key={event.id}
                      className={`bg-slate-800 rounded-lg p-4 border-l-4 ${borderColor}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-100 truncate">{event.title}</p>
                          <p className="text-slate-400 text-sm mt-0.5">
                            {event.all_day
                              ? 'All day'
                              : `${formatDateTime(event.start)}${event.end ? ' – ' + formatTime(event.end) : ''}`
                            }
                          </p>
                          {event.location && (
                            <p className="text-slate-500 text-xs mt-1 truncate">📍 {event.location}</p>
                          )}
                          {event.description && (
                            <p className="text-slate-500 text-xs mt-1 line-clamp-2">{event.description}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{event.calendar}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
