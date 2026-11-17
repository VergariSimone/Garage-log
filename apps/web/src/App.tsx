import { useEffect, useState } from 'react'
import { INTERVENTION_TYPES } from '@garage/shared'

function App() {
  const [health, setHealth] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setHealth)
      .catch((err: unknown) => setError(String(err)))
  }, [])

  return (
    <main>
      <h1>Garage Log</h1>

      <section>
        <h2>Risposta di /api/health</h2>
        {error ? (
          <p>Errore: {error}</p>
        ) : health === null ? (
          <p>Caricamento…</p>
        ) : (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2>Tipi di intervento (da @garage/shared)</h2>
        <ul>
          {INTERVENTION_TYPES.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
