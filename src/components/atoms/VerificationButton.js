import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const VerificationButton = (props) => {
  const { address } = useAccount();
  const { data, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      window.location.href = `http://localhost:3000/register?address=${address}&signature=${data}`;
    },
  })
  const [error, setError] = useState(undefined)
  // Get secret message to sign from server
  async function getSecretMessage() {
    try {
      const resp = await fetch(
        `http://localhost:3000/initialize?address=${address}`
      )
      return (await resp.json()).message
    } catch (err) {
      console.log(err)
    }
  }

  async function handleClick() {
    const msg = await getSecretMessage()
    if (msg) {
      localStorage.setItem('holoTempSecret', msg)
      signMessage({message: msg})
    }
    else {
      setError('Could not retrieve message to sign.')
    }
  }

  return (
    <>
      {/* <div onClick={handleClick} className="verification-button x-button secondary"> */}
      <div onClick={handleClick} className="verification-button">
        Verify yourself
      </div>
      {error && (
        <p>
          Error: {error}
        </p>
      )}
    </>
  );
};

export default VerificationButton;
