import React, { useState, useEffect } from 'react';

const EmotionJournal = () => {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('emotion_journal_entries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('emotion_journal_entries', JSON.stringify(entries));
  }, [entries]);

  const moods = [
    { emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-500', value: 5 },
    { emoji: '🤩', label: 'Excited', color: 'from-pink-500 to-rose-600', value: 5 },
    { emoji: '🧘', label: 'Calm', color: 'from-teal-400 to-emerald-500', value: 4 },
    { emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-slate-500', value: 3 },
    { emoji: '😔', label: 'Sad', color: 'from-blue-400 to-indigo-500', value: 2 },
    { emoji: '😠', label: 'Angry', color: 'from-red-500 to-orange-700', value: 1 },
  ];

  const addEntry = () => {
    if (!mood) return;

    const newEntry = {
      id: Date.now(),
      mood: mood,
      note: note,
      timestamp: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    setMood(null);
    setNote('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const getMoodStats = () => {
    const stats = {};
    entries.forEach(entry => {
      stats[entry.mood.label] = (stats[entry.mood.label] || 0) + 1;
    });
    return stats;
  };

  const stats = getMoodStats();
  const maxCount = Math.max(...Object.values(stats), 1);

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Emotion Journal
          </h2>
          <p className="text-gray-500 font-medium">How are you feeling today?</p>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                mood?.label === m.label
                  ? `bg-gradient-to-br ${m.color} text-white shadow-lg ring-4 ring-purple-100`
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              <span className="text-3xl mb-1">{m.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Note Input */}
        <div className="mb-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about your day (optional)..."
            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-purple-300 focus:bg-white focus:outline-none transition-all resize-none h-24 text-gray-700"
          />
        </div>

        <button
          onClick={addEntry}
          disabled={!mood}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg ${
            mood
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-200 hover:-translate-y-1 active:scale-95'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Logging My Mood
        </button>

        {/* Stats Section */}
        {entries.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-sm">📊</span>
              Mood Distribution
            </h3>
            <div className="flex items-end gap-2 h-32 mb-10 overflow-x-auto pb-2">
              {moods.map((m) => {
                const count = stats[m.label] || 0;
                const height = (count / maxCount) * 100;
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-2 min-w-[50px]">
                    <div className="w-full relative group">
                      <div 
                        className={`w-full bg-gradient-to-t ${m.color} rounded-t-lg transition-all duration-1000 ease-out`}
                        style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                      >
                        {count > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {count} entries
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xl">{m.emoji}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent Entries */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 text-sm">🕰️</span>
              Recent Reflections
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 group relative transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${entry.mood.color} flex items-center justify-center text-2xl shadow-sm`}>
                        {entry.mood.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{entry.mood.label}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 italic">
                          {entry.note || 'No thoughts recorded...'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionJournal;
