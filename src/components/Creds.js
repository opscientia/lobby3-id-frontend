import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import {
  getHoloCredentials,
  getAndDecryptCredentials,
} from '../utils/secrets'

const Creds = () => {
  const [encryptedCreds, setEncryptedCreds] = useState();
  const [unencryptedCreds, setUnencryptedCreds] = useState();

  useEffect(() => {
    setTimeout(() => {
      getHoloCredentials()
        .then(credsTemp => setEncryptedCreds(credsTemp));
      getAndDecryptCredentials()
        .then(credsTemp => setUnencryptedCreds(credsTemp));
    }, 1000)
  }, [])



  return (
    <>
      <h3>Encrypted Creds...</h3>
      {encryptedCreds && 
        <div>
          <p className="encrypted-creds">{encryptedCreds}</p>
        </div>
      }
      <h3>Unencrypted Creds...</h3>
      {unencryptedCreds && Object.keys(unencryptedCreds).map((key, index) => {
        return (
          <p key={index}>{key}: {unencryptedCreds[key]}</p>
        )}
      )}
    </>
  )
}

export default Creds;
