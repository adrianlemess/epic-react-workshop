const {useState, useEffect} = require('react')

export const useLocalStorageState = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key)

    try {
      return JSON.parse(item) || initialValue
    } catch (error) {
      return item | initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}
