import React, { useState, useEffect } from "react";

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");

  // Load habits from local storage on mount
  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem("habits") || "[]");
    setHabits(savedHabits);
  }, []);

  // Sync with local storage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const habit = {
      id: Date.now(),
      name: newHabit.trim(),
      completedDates: [],
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    setHabits([...habits, habit]);
    setNewHabit("");
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split("T")[0];

    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const isCompletedToday = habit.completedDates.includes(today);
          let newCompletedDates;

          if (isCompletedToday) {
            newCompletedDates = habit.completedDates.filter(
              (date) => date !== today
            );
          } else {
            newCompletedDates = [...habit.completedDates, today];
          }

          // Simple streak calculation: count consecutive days backwards from today
          const sortedDates = [...newCompletedDates].sort(
            (a, b) => new Date(b) - new Date(a)
          );
          let streak = 0;
          let currentDate = new Date(today);

          for (let i = 0; i < sortedDates.length; i++) {
            const completionDate = new Date(sortedDates[i]);
            const diffInDays = Math.floor(
              (currentDate - completionDate) / (1000 * 60 * 60 * 24)
            );

            if (diffInDays === 0) {
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else if (diffInDays === 1) {
              // Already subtracted one day in previous iteration or it's the first one and it's yesterday
              // but we start checking from today. If today is missed, streak might be broken depending on logic.
              // For simplicity: if today is completed, streak starts. If not, streak is what was from yesterday.
            } else {
              break;
            }
          }

          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: calculateStreak(newCompletedDates),
          };
        }
        return habit;
      })
    );
  };

  const calculateStreak = (dates) => {
    if (dates.length === 0) return 0;

    const sortedDates = [...new Set(dates)].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    // If neither today nor yesterday is completed, streak is 0
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
      return 0;
    }

    let streak = 0;
    let checkDate = sortedDates.includes(today) ? today : yesterday;

    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates.includes(checkDate)) {
        streak++;
        const d = new Date(checkDate);
        d.setDate(d.getDate() - 1);
        checkDate = d.toISOString().split("T")[0];
      } else {
        break;
      }
    }
    return streak;
  };

  const isCompletedToday = (completedDates) => {
    const today = new Date().toISOString().split("T")[0];
    return completedDates.includes(today);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl m-5 shadow-2xl transition-all duration-300">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Habit Tracker
            </h2>
            <p className="text-gray-500 text-sm mt-1">Consistency is key 🔑</p>
          </div>
          <span className="text-4xl animate-bounce">✨</span>
        </div>

        {/* Form */}
        <form onSubmit={addHabit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit... (e.g. Read 10 mins)"
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-100 focus:outline-none focus:border-purple-400 transition-all text-gray-700"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
          >
            Add
          </button>
        </form>

        {/* Habit List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {habits.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 italic">
                No habits added yet. Start your journey!
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit.id}
                className={`group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCompletedToday(habit.completedDates)
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-100 hover:border-purple-200"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompletedToday(habit.completedDates)
                        ? "bg-green-500 text-white"
                        : "border-2 border-gray-200 text-transparent hover:border-purple-400"
                    }`}
                  >
                    ✓
                  </button>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isCompletedToday(habit.completedDates)
                          ? "text-green-700 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                        🔥 {habit.streak} day streak
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {habit.completedDates.length} total
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                  title="Remove Habit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Weekly Stats */}
        {habits.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
              <span>Quick Stats</span>
              <span>Last 7 Days</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toISOString().split("T")[0];
                const dayName = date.toLocaleDateString("en-US", {
                  weekday: "narrow",
                });
                const isAllCompleted =
                  habits.length > 0 &&
                  habits.every((h) => h.completedDates.includes(dateStr));
                const isSomeCompleted = habits.some((h) =>
                  h.completedDates.includes(dateStr)
                );

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                        isAllCompleted
                          ? "bg-green-500 text-white shadow-md shadow-green-100"
                          : isSomeCompleted
                          ? "bg-purple-400 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {dayName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
