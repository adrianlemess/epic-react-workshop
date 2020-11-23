// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext
const CountContext = React.createContext()

const useCount = () => {
  const context = React.useContext(CountContext)
  if (!context) {
    throw new Error('useCount must be used within a CountProvider.')
  }
  return context
}

const CountProvider = props => {
  const value = React.useState(0)
  return <CountContext.Provider value={value} {...props} />
}

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
  const [count] = useCount()
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext
  // eslint-disable-next-line no-unused-vars
  const [_, setCount] = useCount()

  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      <CountDisplay />
      <Counter />
    </div>
  )
}

export default App
