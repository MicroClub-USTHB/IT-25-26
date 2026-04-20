import { useTheme } from '../context/ThemeContext';

export function ThemedCard() {
  const { isDark } = useTheme();

  return (
    <section className={isDark ? 'theme-card dark' : 'theme-card light'}>
      <h3>Context Demo</h3>
      <p>Current theme: {isDark ? 'Dark' : 'Light'}</p>
    </section>
  );
}