import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

// Display success message, and retrieve user credentials to store in browser
const Verified = () => {
  const [error, setError] = useState();

  useEffect(() => {
    if (!localStorage.getItem('holoTempSecret')) {
      return
    }
    async function getAndSetCredentials() {
      setError(undefined)
      try {
        const resp = await fetch(
          'http://localhost:3000/register/getCredentials', 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              secret: localStorage.getItem('holoTempSecret')
            })
          }
        )
        const data = await resp.json()
        if (data.error) {
          setError(data.error)
        } else {
          const creds = data
          for (const credName of Object.keys(creds)) {
            localStorage.setItem(`holocred-${credName}`, creds[credName])
          }
          localStorage.removeItem('holoTempSecret')
        }
      }
      catch (err) {
        console.log(err)
        setError(`Error: ${err.message}`)
      }
    }
    getAndSetCredentials()
  }, [])

    return (
      <>
        {error ? <p>{error}</p> : <p>Verification succeeded!</p>}
      </>
    )
  }

export default Verified;
