import React, { useState } from 'react';

const QuickNotes = () => {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    setNotes(prev => [{ id: Date.now(), text: trimmed }, ...prev]);
    setNoteText('');
  };

  const removeNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      addNote();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-3xl w-full shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
          Quick Notes
        </h2>
        <p className="text-sm text-gray-500 mb-6 italic">
          Capture ideas, tasks, or reminders in a lightweight scratchpad.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <textarea
            className="flex-1 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent shadow-sm"
            rows={3}
            placeholder="Write a quick note... (Ctrl/⌘ + Enter to save)"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-none py-3 px-8 text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-400/40 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={addNote}
            disabled={!noteText.trim()}
          >
            Add Note
          </button>
        </div>

        <div className="max-h-56 overflow-y-auto pr-1 space-y-3">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No notes yet. Start typing above to create your first note.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-sm text-gray-800 whitespace-pre-wrap text-left">
                  {note.text}
                </p>
                <button
                  className="text-xs font-semibold text-red-500 uppercase tracking-wide px-2 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  onClick={() => removeNote(note.id)}
                >
                  Clear
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickNotes;
