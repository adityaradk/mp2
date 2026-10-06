import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PokemonContext, fetchAllPokemon } from './pokemon'
import type { PokemonState } from './pokemon'

export default function PokemonProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PokemonState>({ pokemon: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    fetchAllPokemon()
      .then((pokemon) => !cancelled && setState({ pokemon, loading: false, error: null }))
      .catch((e: Error) => !cancelled && setState({ pokemon: [], loading: false, error: e.message }))
    return () => {
      cancelled = true
    }
  }, [])

  return <PokemonContext.Provider value={state}>{children}</PokemonContext.Provider>
}
