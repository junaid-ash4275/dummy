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
import CurrencyConverter from "./components/CurrencyConverter";
import PasswordGenerator from "./components/PasswordGenerator";
import DailyMotivation from "./components/DailyMotivation";
import BMICalculator from "./components/BMICalculator";
import TipCalculator from "./components/TipCalculator";
import AgeCalculator from "./components/AgeCalculator";
import TextAnalyzer from "./components/TextAnalyzer";
import BreathingExercise from "./components/BreathingExercise";
import Stopwatch from "./components/Stopwatch";
import HabitTracker from "./components/HabitTracker";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DailyMotivation />
      <HabitTracker />
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
      <CurrencyConverter />
      <PasswordGenerator />
      <BMICalculator />
      <TipCalculator />
      <AgeCalculator />
      <TextAnalyzer />
      <BreathingExercise />
      <Stopwatch />
    </div>
  );
}

export default App;
