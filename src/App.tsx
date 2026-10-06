import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import PokemonProvider from './PokemonProvider'
import ListView from './pages/ListView'
import GalleryView from './pages/GalleryView'
import DetailView from './pages/DetailView'
import styles from './App.module.css'

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.link} ${styles.active}` : styles.link

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PokemonProvider>
        <header className={styles.header}>
          <div className={styles.inner}>
            <span className={styles.logo}>Pokédex</span>
            <nav className={styles.nav}>
              <NavLink to="/" end className={navClass}>
                List
              </NavLink>
              <NavLink to="/gallery" className={navClass}>
                Gallery
              </NavLink>
            </nav>
          </div>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/pokemon/:id" element={<DetailView />} />
            <Route path="*" element={<ListView />} />
          </Routes>
        </main>
        <footer className={styles.footer}>Data from PokéAPI</footer>
      </PokemonProvider>
    </BrowserRouter>
  )
}

export default App
