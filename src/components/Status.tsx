import styles from './Status.module.css'

interface Props {
  loading: boolean
  error: string | null
  empty?: boolean
}

// Shared loading / error / empty message
export default function Status({ loading, error, empty }: Props) {
  if (loading) return <p className={styles.status}>Loading Pokémon…</p>
  if (error) return <p className={`${styles.status} ${styles.error}`}>Error: {error}. Try refreshing.</p>
  if (empty) return <p className={styles.status}>No Pokémon match.</p>
  return null
}
