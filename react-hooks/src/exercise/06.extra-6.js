// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

const pokemonStatus = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

const POKEMON_INITIAL_STATE = {
  pokemon: null,
  error: null,
  status: pokemonStatus.idle,
}
function PokemonInfo({pokemonName}) {
  const [state, setState] = useState(POKEMON_INITIAL_STATE)

  useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({...state, status: pokemonStatus.pending})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({
          ...state,
          pokemon: pokemonData,
          status: pokemonStatus.resolved,
        })
      })
      .catch(err => {
        setState({
          ...state,
          pokemon: null,
          error: err,
          status: pokemonStatus.rejected,
        })
      })
  }, [pokemonName])

  switch (state.status) {
    case pokemonStatus.idle:
      return <p> Submit a pokemon name to start </p>
    case pokemonStatus.pending:
      return <PokemonInfoFallback name={pokemonName} />
    case pokemonStatus.resolved:
      return <PokemonDataView pokemon={state.pokemon} />
    case pokemonStatus.rejected:
      throw new Error(state.error.message)
    default:
      throw new Error('Not mapped')
  }
}

function fallbackError({error}) {
  return (
    <div>
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    </div>
  )
}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={fallbackError}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
