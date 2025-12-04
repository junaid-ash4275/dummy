import QuoteGenerator from "./components/QuoteGenerator";
import ColorPalette from "./components/ColorPalette";
import PomodoroTimer from "./components/PomodoroTimer";
import TaskList from "./components/TaskList";
import WeatherDashboard from "./components/WeatherDashboard";
import DiceRoller from "./components/DiceRoller";
import RandomFactGenerator from "./components/RandomFactGenerator";
import QuickNotes from "./components/QuickNotes";
import JokeGenerator from "./components/JokeGenerator";
import TriviaQuiz from "./components/TriviaQuiz";
import UnitConverter from "./components/UnitConverter";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <QuoteGenerator />
      <JokeGenerator />
      <TriviaQuiz />
      <ColorPalette />
      <PomodoroTimer />
      <TaskList />
      <WeatherDashboard />
      <DiceRoller />
      <RandomFactGenerator />
      <QuickNotes />
      <UnitConverter />
    </div>
  );
}

export default App;
