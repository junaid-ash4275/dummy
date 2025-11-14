import QuoteGenerator from './components/QuoteGenerator';
import ColorPalette from './components/ColorPalette';
import PomodoroTimer from './components/PomodoroTimer';
import TaskList from './components/TaskList';
import WeatherDashboard from './components/WeatherDashboard';
import DiceRoller from './components/DiceRoller';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <QuoteGenerator />
      <ColorPalette />
      <PomodoroTimer />
      <TaskList />
      <WeatherDashboard />
      <DiceRoller />
    </div>
  );
}

export default App;
