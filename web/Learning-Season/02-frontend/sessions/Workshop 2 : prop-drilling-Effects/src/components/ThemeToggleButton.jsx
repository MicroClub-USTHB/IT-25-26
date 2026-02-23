import { useTheme } from '../context/ThemeContext';

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      Switch to {isDark ? 'Light' : 'Dark'} mode
    </button>
  );
}

export default ThemeToggleButton;