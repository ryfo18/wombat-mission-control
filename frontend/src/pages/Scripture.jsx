import React, { useEffect, useState } from 'react';
import api from '../api';

const Scripture = () => {
  const [scripture, setScripture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScripture = async () => {
      try {
        setLoading(true);
        const res = await api.getDailyScripture();
        setScripture(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching scripture:', err);
        setError('Failed to load scripture. Please try again later.');
        // Provide mock data as fallback
        setScripture({
          reference: "Psalm 23:1-6",
          text: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
          reflection_prompt: "How has God been your shepherd recently? Where do you need His guidance and provision?"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScripture();
  }, []);

  const copyToClipboard = () => {
    if (!scripture) return;
    
    const textToCopy = `${scripture.reference}\n\n${scripture.text}\n\nReflection: ${scripture.reflection_prompt}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Verse copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy verse to clipboard');
    });
  };

  if (loading) {
    return <div className="flex h-[200px] items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-400">{error}</div>;
  }

  if (!scripture) {
    return <div className="text-center py-12">No scripture data available.</div>;
  }

  return (
    <div className="text-center py-16">
      <div className="bg-slate-800 rounded-xl p-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-400">
          {scripture.reference}
        </h1>
        <p className="text-2xl font-serif italic text-slate-200 mb-8 leading-relaxed">
          {scripture.text}
        </p>
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Reflection prompt:</h3>
          <p className="text-slate-300 text-lg leading-relaxed">
            {scripture.reflection_prompt}
          </p>
        </div>
        <button
          onClick={copyToClipboard}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default Scripture;