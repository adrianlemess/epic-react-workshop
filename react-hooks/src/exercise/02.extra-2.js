// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect} from 'react'

function Greeting({initialName = ''}) {
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') || initialName,
  )

  const [secondName, setSecondName] = React.useState('')

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  useEffect(() => {
    console.log('useEffect')
    window.localStorage.setItem('name', name)
  }, [name])

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleSecondNameChange(event) {
    setSecondName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />]{' '}
        <label htmlFor="secondName">secondName: </label>
        <input onChange={handleChange} id="secondName" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
