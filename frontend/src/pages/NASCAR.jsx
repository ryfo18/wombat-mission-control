import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function NASCAR() {
  const { track: trackParam } = useParams();
  const track = trackParam ? decodeURIComponent(trackParam) : 'Watkins Glen';
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'history';
  const setView = (v) => setSearchParams({ view: v });

  const [raceYears, setRaceYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch race years on mount
  useEffect(() => {
    async function fetchRaceYears() {
      try {
        const response = await api.getNascarRaceYears(track);
        setRaceYears(response.data);
        if (response.data.length > 0) {
          setSelectedYear(response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching race years:', err);
        setError('Failed to load race years');
      }
    }
    fetchRaceYears();
  }, []);

  // Fetch history when year changes
  useEffect(() => {
    if (!selectedYear) return;
    
    async function fetchHistory() {
      setLoading(true);
      try {
        const response = await api.getNascarTrackHistory(track);
        // filter by selected year client-side since by-year endpoint doesn't support track param
        const filtered = response.data.filter(e => e.race_year === selectedYear);
        setHistory(filtered);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load race history');
      }
      setLoading(false);
    }
    fetchHistory();
  }, [selectedYear]);

  // Fetch trends
  useEffect(() => {
    async function fetchTrends() {
      try {
        const response = await api.getNascarDriverTrends(1, track);
        setTrends(response.data);
      } catch (err) {
        console.error('Error fetching trends:', err);
        setError('Failed to load driver trends');
      }
    }
    fetchTrends();
  }, []);

  const getPositionChange = (start, finish) => {
    const diff = start - finish;
    if (diff > 0) return <span className="text-green-400">+{diff}</span>;
    if (diff < 0) return <span className="text-red-400">{diff}</span>;
    return <span className="text-gray-500">0</span>;
  };

  const getFinishClass = (pos) => {
    if (pos <= 3) return 'text-yellow-400 font-bold';
    if (pos <= 10) return 'text-green-400';
    if (pos <= 20) return 'text-gray-300';
    return 'text-gray-500';
  };

  if (error) {
    return (
      <div className="text-red-400 p-4">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="nascar-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">🏎️ {track} NASCAR History</h1>
          <p className="text-gray-400 mt-1">
            DraftKings scoring • 5 years of race data • 192 driver entries
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'history' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Race History
          </button>
          <button
            onClick={() => setView('trends')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'trends' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Driver Trends
          </button>
        </div>
      </div>

      {/* Note about fastest laps */}
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-6">
        <p className="text-yellow-400 text-sm">
          ⚠️ <strong>Note:</strong> Fastest laps data is not available on driveraverages.com. 
          The dk_fastest_lap_pts column is included in the table but always set to 0.
        </p>
      </div>

      {view === 'history' && (
        <>
          {/* Year selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {raceYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedYear === year
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-3 py-3 text-left text-gray-400 font-medium">Pos</th>
                      <th className="px-3 py-3 text-left text-gray-400 font-medium">Start</th>
                      <th className="px-3 py-3 text-left text-gray-400 font-medium">Driver</th>
                      <th className="px-3 py-3 text-right text-gray-400 font-medium">DK Salary</th>
                      <th className="px-3 py-3 text-left text-gray-400 font-medium">Laps Led</th>
                      <th className="px-3 py-3 text-left text-gray-400 font-medium">Status</th>
                      <th className="px-3 py-3 text-right text-gray-400 font-medium">Finish Pts</th>
                      <th className="px-3 py-3 text-right text-gray-400 font-medium">PD Pts</th>
                      <th className="px-3 py-3 text-right text-gray-400 font-medium">Led Pts</th>
                      <th className="px-3 py-3 text-right text-gray-400 font-medium">Fast Lap</th>
                      <th className="px-3 py-3 text-right text-gray-400 font-medium">TOTAL DK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, idx) => (
                      <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800/50">
                        <td className={`px-3 py-2 ${getFinishClass(entry.finish_pos)}`}>
                          {entry.finish_pos}
                        </td>
                        <td className="px-3 py-2 text-gray-300">{entry.start_pos}</td>
                        <td className="px-3 py-2 text-white font-medium">{entry.driver}</td>
                        <td className="px-3 py-2 text-right text-emerald-400 font-mono text-sm">
                          {entry.dk_salary ? `$${entry.dk_salary.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-3 py-2 text-gray-300">{entry.laps_led}</td>
                        <td className="px-3 py-2 text-gray-400 text-sm">{entry.status}</td>
                        <td className="px-3 py-2 text-right text-blue-400">{entry.dk_finish_pts.toFixed(1)}</td>
                        <td className={`px-3 py-2 text-right ${entry.dk_pd_pts >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {entry.dk_pd_pts >= 0 ? '+' : ''}{entry.dk_pd_pts.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-purple-400">{entry.dk_laps_led_pts.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-orange-400">{entry.dk_fastest_lap_pts.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-white font-bold">{entry.dk_total_pts.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {view === 'trends' && (
        <>
          <p className="text-gray-500 text-sm mb-4">Last 5 races at {track} · sorted by wins, then avg finish</p>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-3 py-3 text-left text-gray-400 font-medium">Driver</th>
                    <th className="px-3 py-3 text-center text-gray-400 font-medium">Races</th>
                    <th className="px-3 py-3 text-center text-gray-400 font-medium">Wins</th>
                    <th className="px-3 py-3 text-center text-gray-400 font-medium">Top 5</th>
                    <th className="px-3 py-3 text-center text-gray-400 font-medium">Top 10</th>
                    <th className="px-3 py-3 text-right text-gray-400 font-medium">Avg Start</th>
                    <th className="px-3 py-3 text-right text-gray-400 font-medium">Avg Finish</th>
                    <th className="px-3 py-3 text-right text-gray-400 font-medium">Total Laps Led</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((driver, idx) => (
                    <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-3 py-2 text-white font-medium">{driver.driver}</td>
                      <td className="px-3 py-2 text-center text-gray-300">{driver.races}</td>
                      <td className="px-3 py-2 text-center">
                        {driver.wins > 0
                          ? <span className="text-yellow-400 font-bold">{driver.wins}</span>
                          : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {driver.top5s > 0
                          ? <span className="text-green-400 font-semibold">{driver.top5s}</span>
                          : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {driver.top10s > 0
                          ? <span className="text-blue-400">{driver.top10s}</span>
                          : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-300">{driver.avg_start}</td>
                      <td className={`px-3 py-2 text-right font-semibold ${
                        driver.avg_finish <= 5 ? 'text-yellow-400' :
                        driver.avg_finish <= 10 ? 'text-green-400' :
                        driver.avg_finish <= 20 ? 'text-gray-300' : 'text-gray-500'
                      }`}>{driver.avg_finish}</td>
                      <td className="px-3 py-2 text-right text-purple-400">
                        {driver.total_laps_led > 0 ? driver.total_laps_led : <span className="text-gray-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NASCAR;
