import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000',
});

const api = {
  // Tasks
  getTasks: () => client.get('/api/tasks'),
  createTask: (taskData) => client.post('/api/tasks', taskData),
  updateTask: (id, taskData) => client.put(`/api/tasks/${id}`, taskData),
  deleteTask: (id) => client.delete(`/api/tasks/${id}`),

  // Research
  getResearch: (topic) => client.get('/api/research', { params: { topic } }),
  createResearch: (researchData) => client.post('/api/research', researchData),
  deleteResearch: (id) => client.delete(`/api/research/${id}`),

  // Scripture
  getDailyScripture: () => client.get('/api/scripture/daily'),

  // Calendar
  getCalendarEvents: (days = 14) => client.get('/api/calendar/events', { params: { days } }),
  getCarpoolRecommendation: (days = 7) => client.get('/api/calendar/carpool', { params: { days } }),

  // NASCAR
  getNascarTracks: () => client.get('/api/nascar/tracks'),
  getNascarUpcoming: () => client.get('/api/nascar/upcoming'),
  getNascarLineups: () => client.get('/api/nascar/upcoming/lineups'),
  getNascarAnalysis: () => client.get('/api/nascar/upcoming/analysis'),
  putNascarLineups: (data) => client.put('/api/nascar/upcoming/lineups', data),
  putNascarAnalysis: (data) => client.put('/api/nascar/upcoming/analysis', data),
  getNascarTrackHistory: (track = 'Watkins Glen') => client.get('/api/nascar/track-history', { params: { track } }),
  getNascarHistoryByYear: (year) => client.get(`/api/nascar/track-history/by-year/${year}`),
  getNascarDriverTrends: (minRaces = 1, track) => client.get('/api/nascar/driver-trends', { params: { min_races: minRaces, track } }),
  getNascarRaceYears: (track) => client.get('/api/nascar/race-years', { params: { track } }),
};

export default api;
