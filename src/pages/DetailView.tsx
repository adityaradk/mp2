import { Link, useLocation, useParams } from 'react-router-dom'
import { capitalize, usePokemon } from '../pokemon'
import type { DetailState } from '../pokemon'
import TypeBadge from '../components/TypeBadge'
import Status from '../components/Status'
import styles from './DetailView.module.css'

export default function DetailView() {
  const { pokemon, loading, error } = usePokemon()
  const { id } = useParams()
  const location = useLocation()

  if (loading || error) return <Status loading={loading} error={error} />

  const current = pokemon.find((p) => p.id === Number(id))
  if (!current) return <p className={styles.missing}>Pokémon #{id} not found. <Link to="/">Back to list</Link></p>

  // Cycle through the list the user came from; fall back to all pokemon by id
  const fromState = (location.state as DetailState | null)?.ids
  const ids = fromState?.includes(current.id) ? fromState : pokemon.map((p) => p.id)
  const index = ids.indexOf(current.id)
  const prevId = ids[(index - 1 + ids.length) % ids.length]
  const nextId = ids[(index + 1) % ids.length]
  const state: DetailState = { ids }

  return (
    <article className={styles.detail}>
      <nav className={styles.pager}>
        <Link to={`/pokemon/${prevId}`} state={state} className={styles.arrow} aria-label="Previous">
          ← Prev
        </Link>
        <span className={styles.position}>
          {index + 1} / {ids.length}
        </span>
        <Link to={`/pokemon/${nextId}`} state={state} className={styles.arrow} aria-label="Next">
          Next →
        </Link>
      </nav>

      <div className={styles.body}>
        <img src={current.artwork} alt={current.name} className={styles.art} />
        <div className={styles.info}>
          <p className={styles.number}>#{String(current.id).padStart(3, '0')}</p>
          <h1>{capitalize(current.name)}</h1>
          <div className={styles.types}>
            {current.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          <dl className={styles.facts}>
            <dt>Height</dt>
            <dd>{current.height / 10} m</dd>
            <dt>Weight</dt>
            <dd>{current.weight / 10} kg</dd>
            <dt>Base XP</dt>
            <dd>{current.baseExperience}</dd>
            <dt>Abilities</dt>
            <dd>{current.abilities.map(capitalize).join(', ')}</dd>
          </dl>

          <h2>Base stats</h2>
          <ul className={styles.stats}>
            {current.stats.map((s) => (
              <li key={s.name}>
                <span className={styles.statName}>{s.name === 'hp' ? 'HP' : s.name.replace('-', ' ')}</span>
                <meter min={0} max={255} value={s.value} />
                <span className={styles.statValue}>{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
