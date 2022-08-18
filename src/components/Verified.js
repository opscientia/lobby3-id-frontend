import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";

import { storeCredentials, getIsHoloRegistered } from "../utils/secrets";

// Display success message, and retrieve user credentials to store in browser
const Verified = () => {
  const [error, setError] = useState();
  const [creds, setCreds] = useState();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // getIsHoloRegistered().then((isRegistered) => setRegistered(isRegistered));
  }, []);

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
  // storeCredentials({
  //   firstName: "Alice",
  //   middleInitial: "C",
  //   lastName: "Bob",
  //   streetAddr1: "123",
  //   streetAddr2: "456",
  //   city: "New York",
  //   subdivision: "NY",
  //   countryCode: "US",
  //   postalCode: "789",
  //   birthdate: "1901-01-01",
  //   completedAt: "00:00:0000",
  //   serverSignature:
  //     "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  //   secret: "0x000000000000000000000000000000000000000000000",
  // });

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h3 style={{ textAlign: "center" }}>Almost finished!</h3>
          <div style={{ maxWidth: "600px", fontSize: "16px" }}>
            <p>Final steps:</p>
            <ol>
              {!registered && (
                <li>
                  Open the Holonym extension, and create an account by entering a
                  password (be sure to remember it)
                </li>
              )}
              <li>
                Login to the Holonym popup{" "}
                {!registered && "(after creating an account)"}
              </li>
              <li>Confirm your credentials</li>
            </ol>
            <p>The Holonym extension will then store your encrypted credentials.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Verified;
