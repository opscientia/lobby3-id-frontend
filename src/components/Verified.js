import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";

import { storeCredentials } from "../utils/secrets";

// Display success message, and retrieve user credentials to store in browser
const Verified = () => {
  const [error, setError] = useState();
  const [creds, setCreds] = useState();

  useEffect(() => {
    if (!localStorage.getItem("holoTempSecret")) {
      return;
    }
    async function getAndSetCredentials() {
      setError(undefined);
      try {
        const secret = localStorage.getItem("holoTempSecret");
        const resp = await fetch(
          `http://localhost:3000/register/credentials?secret=${secret}`
        );
        const data = await resp.json();
        if (data.error) {
          setError(data.error);
        } else {
          const credsTemp = data;
          setCreds(credsTemp);
          storeCredentials(credsTemp);
          localStorage.removeItem("holoTempSecret");
        }
      } catch (err) {
        console.log(err);
        setError(`Error: ${err.message}`);
      }
    }
    getAndSetCredentials();
  }, []);

  // For testing
  // useEffect(() => {
  //   storeCredentials({ firstName: "Alice" });
  // }, []);

  return (
    <>
      {error ? <p>{error}</p> : <p>Verification succeeded!</p>}
      {/* TODO: Delete creds from this page. They're unnecessary */}
      {creds &&
        Object.keys(creds).map((key, index) => {
          return (
            <p key={index}>
              {key}: {creds[key]}
            </p>
          );
        })}
    </>
  );
};

export default Verified;
