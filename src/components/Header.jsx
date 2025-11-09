import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import { useI18n } from '../context/I18nContext.jsx'
import './Header.css'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()

  return (
    <header className="sm-header">
      <Link to="/" className="logo">StyleMuse</Link>
      <nav>
        <NavLink to="/generate">{t('Generate')}</NavLink>
        <NavLink to="/gallery">{t('Gallery')}</NavLink>
        <NavLink to="/closet">{t('My Closet')}</NavLink>
        <NavLink to="/translate">{t('Translate')}</NavLink>
      </nav>
      <div className="tools">
        <button onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '🌙' : '🔆'}
        </button>
      </div>
    </header>
  )
}
