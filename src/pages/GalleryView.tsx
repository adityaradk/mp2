import { Link, useSearchParams } from 'react-router-dom'
import { capitalize, usePokemon } from '../pokemon'
import type { DetailState } from '../pokemon'
import Status from '../components/Status'
import styles from './GalleryView.module.css'

export default function GalleryView() {
  const { pokemon, loading, error } = usePokemon()
  // Selected types live in the URL (?types=fire,water) so they survive navigation
  const [params, setParams] = useSearchParams()
  const selected = (params.get('types') ?? '').split(',').filter(Boolean)

  const allTypes = [...new Set(pokemon.flatMap((p) => p.types))].sort()

  const setSelected = (types: string[]) => {
    setParams(types.length ? { types: types.join(',') } : {}, { replace: true })
  }
  const toggle = (type: string) =>
    setSelected(selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type])

  // Show pokemon that have any of the selected types (or all when none selected)
  const results = selected.length
    ? pokemon.filter((p) => p.types.some((t) => selected.includes(t)))
    : pokemon
  const detailState: DetailState = { ids: results.map((p) => p.id) }

  return (
    <section>
      <div className={styles.filters}>
        {allTypes.map((type) => (
          <button
            key={type}
            className={`${styles.chip} ${selected.includes(type) ? styles.active : ''}`}
            onClick={() => toggle(type)}
            aria-pressed={selected.includes(type)}
          >
            {type}
          </button>
        ))}
        {selected.length > 0 && (
          <button className={styles.clear} onClick={() => setSelected([])}>
            Clear
          </button>
        )}
      </div>

      <Status loading={loading} error={error} empty={!loading && !error && results.length === 0} />

      <div className={styles.grid}>
        {results.map((p) => (
          <Link key={p.id} to={`/pokemon/${p.id}`} state={detailState} className={styles.card}>
            <img src={p.artwork} alt={p.name} loading="lazy" />
            <span>{capitalize(p.name)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
