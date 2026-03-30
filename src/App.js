import LifeProgressTracker from "./components/LifeProgressTracker";
import GlassmorphismGenerator from "./components/GlassmorphismGenerator";
import ExpenseSplitter from "./components/ExpenseSplitter";
import MemoryGame from "./components/MemoryGame";
import WaterTracker from "./components/WaterTracker";
import MoodTracker from "./components/MoodTracker";
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
import TextAnalyzer from "./components/TextAnalyzer";
import BreathingExercise from "./components/BreathingExercise";
import Stopwatch from "./components/Stopwatch";
import FinanceTracker from "./components/FinanceTracker";
import QRCodeGenerator from "./components/QRCodeGenerator";
import MorseCodeConverter from "./components/MorseCodeConverter";
import JsonFormatter from "./components/JsonFormatter";
import MarkdownPreviewer from "./components/MarkdownPreviewer";
import WorldClock from "./components/WorldClock";
import RecipeFinder from "./components/RecipeFinder";
import ZenFocus from "./components/ZenFocus";
import TimeZoneConverter from "./components/TimeZoneConverter";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <LifeProgressTracker />
      <TimeZoneConverter />
      <GlassmorphismGenerator />
      <ZenFocus />
      <MemoryGame />
      <RecipeFinder />
      <MoodTracker />
      <WaterTracker />
      <ExpenseSplitter />
      <WorldClock />
      <MarkdownPreviewer />
      <JsonFormatter />
      <MorseCodeConverter />
      <QRCodeGenerator />
      <DailyMotivation />
      <FinanceTracker />
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
      <TextAnalyzer />
      <BreathingExercise />
      <Stopwatch />
    </div>
  );
}

export default App;
