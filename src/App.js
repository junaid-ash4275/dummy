import QuoteGenerator from './components/QuoteGenerator';
import ColorPalette from './components/ColorPalette';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <QuoteGenerator />
      <ColorPalette />
      <PomodoroTimer />
    </div>
  );
}

export default App;
