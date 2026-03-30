import React, { useState, useEffect } from 'react';

const LifeProgressTracker = () => {
  const [progress, setProgress] = useState({
    day: 0,
    week: 0,
    month: 0,
    year: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const calculateProgress = () => {
    const now = new Date();
    setCurrentTime(now);

    // Day Progress
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayProgress = ((now - startOfDay) / (24 * 60 * 60 * 1000)) * 100;

    // Week Progress (Monday as start)
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 for Monday, 6 for Sunday
    const weekProgress = ((dayOfWeek * 24 * 60 * 60 * 1000 + (now - startOfDay)) / (7 * 24 * 60 * 60 * 1000)) * 100;

    // Month Progress
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const monthProgress = ((now - startOfMonth) / (daysInMonth * 24 * 60 * 60 * 1000)) * 100;

    // Year Progress
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const isLeapYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
    const daysInYear = isLeapYear ? 366 : 365;
    const yearProgress = ((now - startOfYear) / (daysInYear * 24 * 60 * 60 * 1000)) * 100;

    setProgress({
      day: dayProgress.toFixed(2),
      week: weekProgress.toFixed(2),
      month: monthProgress.toFixed(2),
      year: yearProgress.toFixed(2),
    });
  };

  useEffect(() => {
    calculateProgress();
    const timer = setInterval(calculateProgress, 1000);
    return () => clearInterval(timer);
  }, []);

  const ProgressCard = ({ label, value, color, icon, remaining }) => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 bg-white/10 rounded-lg group-hover:animate-bounce">{icon}</span>
          <h3 className="text-lg font-bold text-white tracking-tight">{label}</h3>
        </div>
        <span className="text-sm font-mono font-bold text-white/90 bg-black/20 px-3 py-1 rounded-full border border-white/10">
          {value}%
        </span>
      </div>
      
      <div className="relative h-4 w-full bg-black/20 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out shadow-lg ${color}`}
          style={{ width: `${value}%` }}
        >
          <div className="absolute top-0 right-0 w-2 h-full bg-white/40 blur-sm"></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Temporal Density</p>
        <p className="text-xs text-white/60 font-medium italic">
          {100 - value < 0.01 ? "Completed" : `${(100 - value).toFixed(2)}% remaining`}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-[600px] p-8 bg-[#0f172a] rounded-3xl m-5 shadow-2xl relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Temporal Engine v2.0</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">
            Life <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">Progress</span>
          </h2>
          <p className="text-gray-400 font-medium max-w-md mx-auto">
            "Your time is limited, so don't waste it living someone else's life."
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Live Syncing: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressCard 
            label="Current Day" 
            value={progress.day} 
            icon="☀️" 
            color="bg-gradient-to-r from-cyan-400 to-blue-600" 
          />
          <ProgressCard 
            label="Current Week" 
            value={progress.week} 
            icon="📅" 
            color="bg-gradient-to-r from-emerald-400 to-teal-600" 
          />
          <ProgressCard 
            label="Current Month" 
            value={progress.month} 
            icon="🌙" 
            color="bg-gradient-to-r from-amber-400 to-orange-600" 
          />
          <ProgressCard 
            label="Current Year" 
            value={progress.year} 
            icon="🚀" 
            color="bg-gradient-to-r from-rose-400 to-pink-600" 
          />
        </div>

        <div className="mt-12 text-center border-t border-white/5 pt-8">
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.4em]">
            Time is the most valuable asset you possess. Spend it wisely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifeProgressTracker;
