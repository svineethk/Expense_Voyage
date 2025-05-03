import { useContext } from 'react';
import { ThemeContext } from '../../ThemeContext';
import './index.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className='theme-toggle-btn' onClick={toggleTheme}>
      {theme === 'light' ? '🌙 ' : '☀️'}
    </button>
  );
}

export default ThemeToggle;