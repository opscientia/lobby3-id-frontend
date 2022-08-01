import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const VerificationButton = (props) => {
  const { data: account } = useAccount();
  const { data, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      window.location.href = `http://localhost:3000/register?address=${account.address}&signature=${data}`;
    },
  })
  const [error, setError] = useState(undefined)
  // Get secret message to sign from server
  async function getSecretMessage() {
    const resp = await fetch(
      `http://localhost:3000/initialize?address=${account.address}`
    )
    const secret = (await resp.json()).message
    localStorage.setItem('holoTempSecret', secret)
    return secret
  }

  async function handleClick() {
    const msg = await getSecretMessage()
    if (msg) {
      signMessage({message: msg})
    }
    else {
      setError('Could not retrieve message to sign.')
    }
  }

  return (
    <>
      <div onClick={handleClick} className="return-button x-button secondary">
        <div className="wallet-text">
          Verify yourself
        </div>
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
