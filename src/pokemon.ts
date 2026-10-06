import axios from 'axios'
import { createContext, useContext } from 'react'

const API = 'https://pokeapi.co/api/v2'
export const POKEMON_COUNT = 151

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  baseExperience: number
  types: string[]
  abilities: string[]
  stats: { name: string; value: number }[]
  sprite: string
  artwork: string
}

// Shapes of the parts of the PokeAPI response we use
interface ApiPokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
}

function toPokemon(p: ApiPokemon): Pokemon {
  return {
    id: p.id,
    name: p.name,
    height: p.height,
    weight: p.weight,
    baseExperience: p.base_experience ?? 0,
    types: p.types.map((t) => t.type.name),
    abilities: p.abilities.map((a) => a.ability.name),
    stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    sprite: p.sprites.front_default ?? '',
    artwork: p.sprites.other?.['official-artwork']?.front_default ?? p.sprites.front_default ?? '',
  }
}

// Fetches the first POKEMON_COUNT pokemon. Individual failures are skipped
// so one bad request doesn't break the whole app.
export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1)
  const results = await Promise.allSettled(
    ids.map((id) => axios.get<ApiPokemon>(`${API}/pokemon/${id}`)),
  )
  const pokemon = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => toPokemon(r.value.data))
  if (pokemon.length === 0) throw new Error('Could not reach PokeAPI')
  return pokemon
}

export interface PokemonState {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
}

export const PokemonContext = createContext<PokemonState>({
  pokemon: [],
  loading: true,
  error: null,
})

export const usePokemon = () => useContext(PokemonContext)

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Ids of the list the user navigated from, passed as router state to the detail view
export interface DetailState {
  ids: number[]
}
