import { Link, useSearchParams } from 'react-router-dom'
import { capitalize, usePokemon } from '../pokemon'
import type { DetailState, Pokemon } from '../pokemon'
import TypeBadge from '../components/TypeBadge'
import Status from '../components/Status'
import styles from './ListView.module.css'

const SORT_KEYS = {
  name: 'Name',
  id: 'ID',
  height: 'Height',
  weight: 'Weight',
  baseExperience: 'Base XP',
} as const
type SortKey = keyof typeof SORT_KEYS

export default function ListView() {
  const { pokemon, loading, error } = usePokemon()
  // Search/sort live in the URL so they survive going to a detail page and back
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const sortKey: SortKey = (params.get('sort') as SortKey) in SORT_KEYS ? (params.get('sort') as SortKey) : 'id'
  const order = params.get('order') === 'desc' ? 'desc' : 'asc'

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next, { replace: true })
  }

  const q = query.trim().toLowerCase()
  const results = pokemon
    .filter((p) => p.name.includes(q) || String(p.id) === q)
    .sort((a: Pokemon, b: Pokemon) => {
      const cmp = sortKey === 'name' ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey]
      return order === 'asc' ? cmp : -cmp
    })
  const detailState: DetailState = { ids: results.map((p) => p.id) }

  return (
    <section>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search Pokémon by name or #…"
          value={query}
          onChange={(e) => update('q', e.target.value)}
          aria-label="Search"
        />
        <label className={styles.label}>
          Sort by
          <select value={sortKey} onChange={(e) => update('sort', e.target.value)}>
            {Object.entries(SORT_KEYS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          className={styles.order}
          onClick={() => update('order', order === 'asc' ? 'desc' : 'asc')}
        >
          {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>

      <Status loading={loading} error={error} empty={!loading && !error && results.length === 0} />

      <ul className={styles.list}>
        {results.map((p) => (
          <li key={p.id}>
            <Link to={`/pokemon/${p.id}`} state={detailState} className={styles.row}>
              <img src={p.sprite} alt={p.name} className={styles.sprite} loading="lazy" />
              <span className={styles.id}>#{String(p.id).padStart(3, '0')}</span>
              <span className={styles.name}>{capitalize(p.name)}</span>
              <span className={styles.types}>
                {p.types.map((t) => (
                  <TypeBadge key={t} type={t} />
                ))}
              </span>
              <span className={styles.meta}>
                {p.height / 10} m · {p.weight / 10} kg · {p.baseExperience} XP
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
