import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const TRACK_EMOJIS = {
  'Watkins Glen': '🌀',
};

function NASCARTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const defaultView = searchParams.get('view') || 'history';
  const navigate = useNavigate();

  useEffect(() => {
    api.getNascarTracks()
      .then(res => setTracks(res.data))
      .catch(() => setError('Failed to load tracks'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading tracks...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">🏎️ NASCAR Track History</h1>
        <p className="text-gray-400 mt-1">Select a track to view race history and driver trends.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        {tracks.map(track => (
          <button
            key={track.name}
            onClick={() => navigate(`/nascar/track/${encodeURIComponent(track.name)}?view=${defaultView}`)}
            className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-slate-700 hover:border-indigo-500 rounded-xl p-5 text-left transition group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{TRACK_EMOJIS[track.name] || '🏁'}</span>
              <div>
                <div className="text-white font-semibold text-lg group-hover:text-indigo-300 transition">
                  {track.name}
                </div>
                <div className="text-gray-400 text-sm mt-0.5">
                  {track.years} season{track.years !== 1 ? 's' : ''} · {track.first_year}–{track.last_year}
                </div>
              </div>
            </div>
            <span className="text-gray-600 group-hover:text-indigo-400 text-xl transition">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NASCARTracks;
