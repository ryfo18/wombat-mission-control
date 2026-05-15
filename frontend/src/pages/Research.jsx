import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const getCardExcerpt = (text, maxChars = 200) => {
  if (!text) return '';
  const lines = text.split('\n')
    .map(line => line
      .replace(/^#{1,6}\s+.*$/, '')         // drop heading lines entirely
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/^\s*[-*+]\s+/g, '\u2022 ')
      .replace(/^\s*\d+\.\s+/g, '\u2022 ')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/^>\s+/, '')
      .replace(/\|.+\|/, '')
      .trim()
    )
    .filter(line => line.length > 0);

  const joined = lines.join('  \n');
  if (joined.length <= maxChars) return joined;
  return joined.slice(0, maxChars).replace(/\s+\S*$/, '') + '\u2026';
};

const Research = () => {
  const [researchItems, setResearchItems] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [newResearch, setNewResearch] = useState({
    title: '',
    summary: '',
    topic: '',
    url: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResearch = async () => {
      try {
        const res = await api.getResearch();
        const data = res.data;
        setResearchItems(data);
        setFilteredResearch(data);
        
        // Extract unique topics
        const uniqueTopics = [...new Set(data.map(item => item.topic))];
        setTopics(uniqueTopics);
      } catch (error) {
        console.error('Error fetching research:', error);
        // Set mock data if API fails
        const mockData = [
          { id: 1, title: "React Best Practices", summary: "Learn modern React patterns", topic: "Development", url: "https://react.dev", created_at: new Date().toISOString() },
          { id: 2, title: "Tailwind CSS Guide", summary: "Utility-first CSS framework", topic: "Design", url: "https://tailwindcss.com", created_at: new Date().toISOString() }
        ];
        setResearchItems(mockData);
        setFilteredResearch(mockData);
        setTopics(["Development", "Design"]);
      } finally {
        setLoading(false);
      }
    };

    loadResearch();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      const filtered = researchItems.filter(item => item.topic === selectedTopic);
      setFilteredResearch(filtered);
    } else {
      setFilteredResearch(researchItems);
    }
  }, [selectedTopic, researchItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewResearch(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newResearch.title.trim()) return;

    try {
      const res = await api.createResearch(newResearch);
      setResearchItems([...researchItems, res.data]);
      setFilteredResearch([...filteredResearch, res.data]);
      
      // Update topics if new
      if (!topics.includes(newResearch.topic)) {
        setTopics([...topics, newResearch.topic]);
      }
      
      // Reset form
      setNewResearch({ title: '', summary: '', topic: '', url: '' });
    } catch (error) {
      console.error('Error creating research:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteResearch(id);
      setResearchItems(researchItems.filter(item => item.id !== id));
      setFilteredResearch(filteredResearch.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting research:', error);
    }
  };

  if (loading) {
    return <div className="flex h-[200px] items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Research</h2>
      
      {/* Filter Bar */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Filter by Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Topics</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        
        {/* Add Research Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={newResearch.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                name="topic"
                value={newResearch.topic}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Summary</label>
            <textarea
              name="summary"
              value={newResearch.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL (optional)</label>
            <input
              type="text"
              name="url"
              value={newResearch.url}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={!newResearch.title.trim()}
          >
            Add Research
          </button>
        </form>
      </div>
      
      {/* Research Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResearch.length > 0 ? (
          filteredResearch.map(item => (
            <div key={item.id} className="bg-slate-800 rounded-lg p-6 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => navigate(`/research/${item.id}`)}>  
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <span className="px-2 py-1 bg-indigo-500 text-xs rounded">{item.topic}</span>
              </div>
              <p className="text-slate-400 mb-4 text-sm whitespace-pre-line leading-relaxed">{getCardExcerpt(item.summary)}</p>
              {item.url && (
                <div className="mb-4">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                    🔗 {item.url}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Added: {new Date(item.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-slate-500 py-12">
            No research items found. Add some research to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;