// Basic Forms
// 💯 using refs
// http://localhost:3000/isolated/final/06.extra-1.js

import React, {useState} from 'react';

function UsernameForm({onSubmitUsername}) {
  const usernameInputRef = React.useRef();
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitUsername(usernameInputRef.current.value);
  }

  function handleChange(event) {
    event.preventDefault();

    const isValid =
      usernameInputRef.current.value ===
      usernameInputRef.current.value.toLowerCase();

    setError(isValid ? null : 'Username must be lower case');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          onChange={handleChange}
          id="usernameInput"
          type="text"
          ref={usernameInputRef}
        />
        {error ? (
          <p role="alert" style={{color: 'red'}}>
            {error}
          </p>
        ) : null}
      </div>
      <button disabled={!!error} type="submit">
        Submit
      </button>
    </form>
  );
}

function App() {
  const onSubmitUsername = username => alert(`You entered: ${username}`);
  return <UsernameForm onSubmitUsername={onSubmitUsername} />;
}

export default App;
