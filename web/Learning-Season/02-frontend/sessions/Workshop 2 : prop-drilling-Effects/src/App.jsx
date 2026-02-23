import './App.css';
import CompositionExample from './components/composition/CompositionExample';
import CompoundExample from './components/compound/CompoundExample';
import ThemeToggleButton from './components/ThemeToggleButton';
import { ThemeProvider } from './context/ThemeContext';
import { ThemedCard } from './context/ThemedCard';
import UseEffectExample from './components/effects/UseEffectExample';
import { initialTasks } from './data/tasks';


function App() {
  return (
    <main className="page">
      <header className="header">
        <p className="header-kicker">React Workshop</p>
        <h1>Prop Drilling Starter (Live Workshop)</h1>
        <p>
          This app intentionally keeps only the prop drilling baseline. You will implement
          composition, compound components, context, and useEffect live with students.
        </p>
      </header>
    <UseEffectExample tasks={initialTasks} />
      <CompoundExample />
    <ThemeProvider >
      <ThemeToggleButton />
      <ThemedCard />
    </ThemeProvider>
    </main>


  );
}

export default App;
