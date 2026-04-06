import React, { useState, useEffect, useRef } from "react";

const ReadingSpeedTest = () => {
  const [testState, setTestState] = useState("idle"); // idle, reading, finished
  const [selectedText, setSelectedText] = useState("short");
  const [customText, setCustomText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const texts = {
    short: {
      title: "Short (80 words)",
      content: "The curious cat leaped onto the velvet sofa, landing with a soft thud that barely disturbed the silence of the room. Outside, the rain tapped gently against the windowpane, a rhythmic melody that seemed to soothe the weary soul. In the distance, a lighthouse winked its solitary eye, guiding lost ships through the misty harbor. Life, in its quietest moments, often whispers the most profound secrets to those who are willing to pause and listen to the stillness.",
    },
    medium: {
      title: "Medium (150 words)",
      content: "Technological advancement in the twenty-first century has fundamentally reshaped the way we interact with the world around us. From the palm of our hands, we can now access the collective knowledge of humanity, communicate across continents in an instant, and manage our daily lives with unprecedented efficiency. However, this hyper-connectivity comes with its own set of challenges, as the digital realm increasingly encroaches upon our physical presence. The constant stream of notifications and the allure of social media often demand our attention, making it harder to find moments of true solitude and reflection. As we continue to navigate this digital landscape, it becomes essential to strike a balance between the convenience of technology and the richness of real-world experiences. We must learn to disconnect occasionally, to put down our devices and reconnect with the natural world, with our loved ones, and with our own inner thoughts, ensuring that we remain the masters of our tools rather than their servants.",
    },
    long: {
      title: "Long (250 words)",
      content: "The exploration of deep space has long been a dream of humanity, fueled by an innate curiosity about our origins and our place in the vast cosmos. Since the early days of the space race, we have made remarkable strides, from landing a man on the moon to sending robotic explorers to the far reaches of our solar system. Each mission brings us closer to answering fundamental questions about the existence of life beyond Earth and the long-term sustainability of our species among the stars. The challenges of interstellar travel are immense, requiring innovations in propulsion, life support systems, and radiation shielding that currently push the limits of our scientific understanding. Yet, the potential rewards are equally staggering. Imagine a future where humanity is a multi-planetary species, with self-sustaining colonies on Mars and research outposts orbiting the moons of Jupiter. Such an endeavor would not only ensure the survival of our civilization against global catastrophes but also inspire generations to come to pursue excellence in science and engineering. It would be a testament to our collective ingenuity and our refusal to be bound by the gravitational pull of our home planet. As we look toward the horizon, the stars beckon with the promise of discovery and the hope of a brighter future for all. The journey will be long and arduous, but the drive to explore is woven into the very fabric of our being, and it is through this pursuit that we truly discover what it means to be human.",
    },
  };

  const currentText = selectedText === "custom" ? customText : texts[selectedText].content;
  const wordCount = currentText.trim().split(/\s+/).length;

  useEffect(() => {
    if (testState === "reading") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [testState]);

  const startTest = () => {
    if (selectedText === "custom" && !customText.trim()) return;
    setStartTime(Date.now());
    setElapsedTime(0);
    setTestState("reading");
    setWpm(0);
  };

  const finishTest = () => {
    const end = Date.now();
    setEndTime(end);
    const durationInMinutes = (end - startTime) / 60000;
    const calculatedWpm = Math.round(wordCount / durationInMinutes);
    setWpm(calculatedWpm);
    setTestState("finished");
  };

  const resetTest = () => {
    setTestState("idle");
    setElapsedTime(0);
    setWpm(0);
  };

  const getFeedback = () => {
    if (wpm < 150) return { label: "Casual Reader", color: "text-blue-500", icon: "📖" };
    if (wpm < 250) return { label: "Average Reader", color: "text-green-500", icon: "✅" };
    if (wpm < 400) return { label: "Skilled Reader", color: "text-yellow-500", icon: "🚀" };
    return { label: "Speed Reader", color: "text-purple-500", icon: "⚡" };
  };

  const feedback = getFeedback();

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl m-5 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-3xl max-w-4xl w-full shadow-2xl relative z-10 border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reading Speed Test
            </h2>
            <p className="text-gray-500 font-medium">Measure your words per minute (WPM)</p>
          </div>
          <div className="text-4xl">⏱️</div>
        </div>

        {testState === "idle" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Select Difficulty
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(texts).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedText(key)}
                      className={`py-3 px-4 rounded-xl font-bold transition-all ${
                        selectedText === key
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {texts[key].title.split(" ")[0]}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedText("custom")}
                    className={`py-3 px-4 rounded-xl font-bold transition-all ${
                      selectedText === "custom"
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Custom Text
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Details
                </label>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Approx. Words:</span>
                    <span className="font-bold text-blue-700">{wordCount}</span>
                  </div>
                  <p className="text-xs text-blue-600 italic">
                    {selectedText === "custom" 
                      ? "Paste your own text below to test your speed." 
                      : "Ready to test your focus? Click start when you are ready."}
                  </p>
                </div>
              </div>
            </div>

            {selectedText === "custom" && (
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700 font-medium"
              />
            )}

            <button
              onClick={startTest}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              START TEST
            </button>
          </div>
        )}

        {testState === "reading" && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="font-mono text-2xl font-bold text-gray-700">
                  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                READING MODE
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 shadow-inner mb-8 leading-relaxed text-xl text-gray-800 font-serif max-h-[400px] overflow-y-auto custom-scrollbar">
              {currentText}
            </div>

            <button
              onClick={finishTest}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              I'M FINISHED READING
            </button>
          </div>
        )}

        {testState === "finished" && (
          <div className="text-center py-10 animate-scaleUp">
            <div className="mb-6 inline-block p-6 bg-blue-50 rounded-full border-4 border-white shadow-xl relative">
              <span className="text-6xl">{feedback.icon}</span>
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                RESULT
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Reading Speed</h3>
            <div className="text-8xl font-black bg-gradient-to-b from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2">
              {wpm}
            </div>
            <p className="text-xl font-bold text-gray-500 mb-8 lowercase tracking-tighter">Words Per Minute</p>
            
            <div className={`text-2xl font-black mb-10 p-4 rounded-2xl bg-gray-50 border border-gray-100 ${feedback.color}`}>
              {feedback.label}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={resetTest}
                className="py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                TEST AGAIN
              </button>
              <button
                onClick={() => setTestState("idle")}
                className="py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                CHANGE TEXT
              </button>
            </div>
          </div>
        )}
        
        {/* Info Box */}
        <div className="mt-10 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
          <span className="text-2xl mt-1">💡</span>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            The average reading speed for adults is around <span className="font-bold text-blue-600">200-250 WPM</span>. Speed reading techniques can push this beyond <span className="font-bold text-purple-600">400 WPM</span>. Focus on comprehension and keep practicing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadingSpeedTest;
