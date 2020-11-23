// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import React, {useEffect} from 'react'
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt'

function Tilt({children}) {
  // 🐨 create a ref here with React.useRef()
  const divRef = React.useRef()
  useEffect(() => {
    const tiltNode = divRef.current
    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    })

    return () => tiltNode.vanillaTilt.destroy()
  }, [])

  // 🐨 add the `ref` prop to the `tilt-root` div here:
  return (
    <div ref={divRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

export default App
