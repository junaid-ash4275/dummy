import React, { useEffect, useMemo, useRef, useState } from "react";

const FocusSoundscape = () => {
  const audioRef = useRef({
    ctx: null,
    masterGain: null,
    leftOsc: null,
    rightOsc: null,
    leftGain: null,
    rightGain: null,
    leftPan: null,
    rightPan: null,
  });

  const [running, setRunning] = useState(false);
  const [baseHz, setBaseHz] = useState(() => {
    const saved = localStorage.getItem("focus_soundscape_base_hz");
    return saved ? Number(saved) : 200;
  });
  const [beatHz, setBeatHz] = useState(() => {
    const saved = localStorage.getItem("focus_soundscape_beat_hz");
    return saved ? Number(saved) : 8;
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("focus_soundscape_volume");
    return saved ? Number(saved) : 0.08;
  });

  useEffect(() => {
    localStorage.setItem("focus_soundscape_base_hz", String(baseHz));
  }, [baseHz]);

  useEffect(() => {
    localStorage.setItem("focus_soundscape_beat_hz", String(beatHz));
  }, [beatHz]);

  useEffect(() => {
    localStorage.setItem("focus_soundscape_volume", String(volume));
  }, [volume]);

  const frequencies = useMemo(() => {
    const half = beatHz / 2;
    const left = Math.max(20, Math.min(1000, baseHz - half));
    const right = Math.max(20, Math.min(1000, baseHz + half));
    return { left, right };
  }, [baseHz, beatHz]);

  const safeClose = async () => {
    const { ctx } = audioRef.current;
    if (!ctx) return;

    try {
      await ctx.close();
    } catch {
      // ignore
    } finally {
      audioRef.current = {
        ctx: null,
        masterGain: null,
        leftOsc: null,
        rightOsc: null,
        leftGain: null,
        rightGain: null,
        leftPan: null,
        rightPan: null,
      };
    }
  };

  const stop = async () => {
    const { leftOsc, rightOsc, masterGain, ctx } = audioRef.current;

    if (masterGain && ctx) {
      try {
        masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03);
      } catch {
        // ignore
      }
    }

    try {
      leftOsc?.stop();
    } catch {
      // ignore
    }
    try {
      rightOsc?.stop();
    } catch {
      // ignore
    }

    setRunning(false);

    setTimeout(() => {
      void safeClose();
    }, 120);
  };

  const start = async () => {
    if (running) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;

    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();

    leftOsc.type = "sine";
    rightOsc.type = "sine";

    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    leftGain.gain.value = 0.6;
    rightGain.gain.value = 0.6;

    const canPan = typeof ctx.createStereoPanner === "function";
    const leftPan = canPan ? ctx.createStereoPanner() : null;
    const rightPan = canPan ? ctx.createStereoPanner() : null;
    if (leftPan) leftPan.pan.value = -0.9;
    if (rightPan) rightPan.pan.value = 0.9;

    leftOsc.frequency.value = frequencies.left;
    rightOsc.frequency.value = frequencies.right;

    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);

    if (leftPan) {
      leftGain.connect(leftPan);
      leftPan.connect(masterGain);
    } else {
      leftGain.connect(masterGain);
    }

    if (rightPan) {
      rightGain.connect(rightPan);
      rightPan.connect(masterGain);
    } else {
      rightGain.connect(masterGain);
    }

    masterGain.connect(ctx.destination);

    leftOsc.start();
    rightOsc.start();

    audioRef.current = {
      ctx,
      masterGain,
      leftOsc,
      rightOsc,
      leftGain,
      rightGain,
      leftPan,
      rightPan,
    };

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }

    try {
      masterGain.gain.setTargetAtTime(Math.max(0.01, Math.min(0.25, volume)), ctx.currentTime, 0.03);
    } catch {
      masterGain.gain.value = Math.max(0.01, Math.min(0.25, volume));
    }

    setRunning(true);
  };

  useEffect(() => {
    const { ctx, leftOsc, rightOsc, masterGain } = audioRef.current;
    if (!running || !ctx || !leftOsc || !rightOsc) return;

    try {
      leftOsc.frequency.setTargetAtTime(frequencies.left, ctx.currentTime, 0.02);
      rightOsc.frequency.setTargetAtTime(frequencies.right, ctx.currentTime, 0.02);
    } catch {
      leftOsc.frequency.value = frequencies.left;
      rightOsc.frequency.value = frequencies.right;
    }

    if (masterGain) {
      try {
        masterGain.gain.setTargetAtTime(Math.max(0.01, Math.min(0.25, volume)), ctx.currentTime, 0.03);
      } catch {
        masterGain.gain.value = Math.max(0.01, Math.min(0.25, volume));
      }
    }
  }, [frequencies.left, frequencies.right, running, volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current.ctx) {
        void safeClose();
      }
    };
  }, []);

  const presets = [
    { label: "Deep Focus", base: 200, beat: 8 },
    { label: "Relax", base: 180, beat: 4 },
    { label: "Calm Flow", base: 220, beat: 10 },
    { label: "Study", base: 240, beat: 14 },
  ];

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl max-w-3xl w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-2">
            Focus Soundscape
          </h2>
          <p className="text-gray-500 font-medium">
            A simple binaural beat generator for sessions where you want to lock in.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-100 border border-indigo-100 p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">Now Playing</div>
                <div className="text-2xl font-black text-indigo-700">
                  {running ? "Binaural Beats" : "Silence"}
                </div>
              </div>
              <button
                onClick={running ? () => void stop() : () => void start()}
                className={`px-5 py-3 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg active:scale-95 ${
                  running
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:-translate-y-0.5"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:-translate-y-0.5"
                }`}
              >
                {running ? "Stop" : "Start"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Left Ear</div>
                <div className="text-2xl font-black text-gray-800">{Math.round(frequencies.left)} Hz</div>
              </div>
              <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Right Ear</div>
                <div className="text-2xl font-black text-gray-800">{Math.round(frequencies.right)} Hz</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 leading-relaxed">
              Works best with headphones. Keep volume low.
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Presets</div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setBaseHz(p.base);
                      setBeatHz(p.beat);
                    }}
                    className="px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-xs font-bold text-gray-700 transition-all active:scale-95"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Base Frequency</label>
                  <span className="text-xs font-mono text-gray-400">{baseHz} Hz</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={400}
                  value={baseHz}
                  onChange={(e) => setBaseHz(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Beat Difference</label>
                  <span className="text-xs font-mono text-gray-400">{beatHz} Hz</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={beatHz}
                  onChange={(e) => setBeatHz(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Volume</label>
                  <span className="text-xs font-mono text-gray-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.25}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">Tip</div>
              <div className="text-sm text-gray-600">
                Pair this with your Pomodoro timer. Start the soundscape at the beginning of a focus block, stop it during breaks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSoundscape;
