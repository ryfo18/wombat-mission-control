import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api';

const ResearchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getResearch();
        const found = res.data.find(r => r.id === parseInt(id));
        setItem(found || null);
      } catch (err) {
        console.error('Error loading research item:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="flex h-[200px] items-center justify-center">Loading...</div>;
  if (!item) return (
    <div className="space-y-4">
      <button onClick={() => navigate('/research')} className="text-indigo-400 hover:text-indigo-300">← Back to Research</button>
      <p className="text-slate-400">Research item not found.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/research')} className="text-indigo-400 hover:text-indigo-300 text-sm">
        ← Back to Research
      </button>

      <div className="bg-slate-800 rounded-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-indigo-500 text-xs rounded">{item.topic}</span>
              <span className="text-xs text-slate-500">Added: {new Date(item.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {item.url && (
          <div className="mb-6">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm">
              🔗 {item.url}
            </a>
          </div>
        )}

        <div className="prose prose-invert prose-slate max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-slate-100 prose-a:text-indigo-400 prose-code:text-indigo-300 prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 prose-table:text-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.summary}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResearchDetail;
