import React, { useState, useEffect } from 'react';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [note, setNote] = useState('');

  const moodOptions = [
    { label: 'Happy', emoji: '😊', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { label: 'Energetic', emoji: '⚡', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { label: 'Relaxed', emoji: '🧘', color: 'bg-green-100 text-green-600 border-green-200' },
    { label: 'Neutral', emoji: '😐', color: 'bg-gray-100 text-gray-600 border-gray-200' },
    { label: 'Sad', emoji: '😢', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { label: 'Stressed', emoji: '😫', color: 'bg-red-100 text-red-600 border-red-200' },
  ];

  useEffect(() => {
    const savedMoods = JSON.parse(localStorage.getItem('mood_history') || '[]');
    setMoods(savedMoods);
  }, []);

  const saveMood = () => {
    if (!currentMood) return;

    const newEntry = {
      id: Date.now(),
      mood: currentMood,
      note: note.trim(),
      timestamp: new Date().toLocaleString(),
    };

    const updatedMoods = [newEntry, ...moods];
    setMoods(updatedMoods);
    localStorage.setItem('mood_history', JSON.stringify(updatedMoods));
    
    // Reset form
    setCurrentMood(null);
    setNote('');
  };

  const deleteEntry = (id) => {
    const updatedMoods = moods.filter(m => m.id !== id);
    setMoods(updatedMoods);
    localStorage.setItem('mood_history', JSON.stringify(updatedMoods));
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-rose-300 via-peach-200 to-yellow-100 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl max-w-xl w-full shadow-xl border border-white/40">
        <h2 className="text-3xl font-bold text-rose-800 mb-2 text-center">Mood Tracker</h2>
        <p className="text-center text-rose-600/70 text-sm mb-8 italic">How are you feeling today?</p>

        {/* Mood Selection */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {moodOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setCurrentMood(option)}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all transform hover:scale-105 active:scale-95 ${
                currentMood?.label === option.label
                  ? `${option.color} scale-110 shadow-md`
                  : 'bg-white/50 border-transparent hover:border-rose-200'
              }`}
            >
              <span className="text-3xl mb-1">{option.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Note Input */}
        <div className="space-y-4 mb-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a quick note... (optional)"
            className="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:outline-none focus:border-rose-400 bg-white/50 min-h-[80px] transition-all"
          />
          <button
            onClick={saveMood}
            disabled={!currentMood}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
              currentMood 
                ? 'bg-rose-500 hover:bg-rose-600 transform hover:-translate-y-1' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Log Mood
          </button>
        </div>

        {/* History Section */}
        {moods.length > 0 && (
          <div className="mt-8 pt-6 border-t border-rose-100">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4">Recent Reflections</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {moods.map((entry) => (
                <div 
                  key={entry.id} 
                  className="group relative flex items-start gap-4 p-4 rounded-xl bg-white/40 border border-white/60 hover:bg-white/60 transition-all"
                >
                  <span className="text-2xl mt-1">{entry.mood.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-tighter">{entry.mood.label}</span>
                      <span className="text-[10px] text-gray-400">{entry.timestamp}</span>
                    </div>
                    {entry.note && <p className="text-sm text-gray-700 mt-1 leading-relaxed">{entry.note}</p>}
                  </div>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 px-2 transition-all"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
