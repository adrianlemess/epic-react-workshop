// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const countReducer = (state, action) => {
  return {...state, count: action}
}

function Counter({initialCount = 0, step = 1}) {
  const [state, changeCountState] = React.useReducer(countReducer, {
    count: initialCount,
  })

  const {count} = state
  const increment = () => changeCountState(count + step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
