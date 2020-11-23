// Basic Forms
// 💯 using refs
// http://localhost:3000/isolated/final/06.extra-1.js

import React, {useState} from 'react';

function UsernameForm({onSubmitUsername}) {
  const [username, setUsername] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitUsername(username);
  }

  function handleChange(event) {
    event.preventDefault();

    setUsername(event.target.value.toLowerCase());
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          onChange={handleChange}
          id="usernameInput"
          type="text"
          defaultValue="bla"
          value={username}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

function App() {
  const onSubmitUsername = username => alert(`You entered: ${username}`);
  return <UsernameForm onSubmitUsername={onSubmitUsername} />;
}

export default App;
