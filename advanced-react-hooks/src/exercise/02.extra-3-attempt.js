// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: action.data, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: action.data, error: action.error}
    }
    case 'cancelled': {
      return {
        status: 'cancelled',
        data: null,
        error: 'Request Cancelled',
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useAsync = initialState => {
  let isCanceled = false

  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const run = React.useCallback(promise => {
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    if (!isCanceled) {
      console.log('Dentro da promise')
      promise.then(
        data => {
          dispatch({type: 'resolved', data})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
      )
    } else {
      console.log('Fui cancelado')

      dispatch({type: 'cancelled'})
    }
  }, [])

  return {
    ...state,
    run,
    cancel: () => {
      console.log('Cancel()')
      isCanceled = true
    },
  }
}

function PokemonInfo({pokemonName}) {
  const {data: pokemon, status, error, run, cancel} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
    return () => {
      console.log('clean up')
      cancel()
    }
  }, [pokemonName, run])

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [isAborted, setIsAborted] = React.useState(false)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
    setTimeout(() => {
      setIsAborted(true)
      console.log('Fui abortado')
    }, 500)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          {isAborted ? null : <PokemonInfo pokemonName={pokemonName} />}
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
