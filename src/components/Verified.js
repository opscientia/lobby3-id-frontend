import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { storeCredentials, getIsHoloRegistered } from "../utils/secrets";

const testCreds = {
  bigCredsSecret: "0xc01653f76c16369f2ceea6941f57846f",
  bigCredsSignature:
    "0x10e751cb9e3458afdf72380bf1d26a953195e09545726ebccf82fb53515c2fe029f1d0defb107a4db019e2e69bbc7b8bb050ee0e697a1d8f92feecdee102a7211c",
  birthdate: "",
  birthdateSecret: "0xca4d4368238bc9efcc137482bfff5a5a",
  birthdateSignature:
    "0xcfcd8920b2b7dbbb55717bad53beca4a0048e8b1c2c4462b68e2fab9491cecf03a468716e12f7d4cec63c466cc9cf8cdf7bc6682853ab4807a70d4d1b61934cd1c",
  city: "",
  citySecret: "0xdba0a98046b916fc8bfe5410357eb303",
  citySignature:
    "0x99261b497222b2b77198a77c3cbc7c3711a06e1f0f098c69559e69ae92c0f8cb570ceac17319719dd5aaf8fb83db952d537fe1d11abf4acba9a84ef5608132f01b",
  completedAt: "2022-08-18T17:04:29.000Z",
  completedAtSecret: "0x4dce2f407bc0599198c8af860417c5a5",
  completedAtSignature:
    "0x2eddcddaac730c8d3779c5b676e997205db7a82bc097fe6678bb29e75c2709452f52b120492dcaa9d95d4f8b9afa792f7f6b66446a978c1167abe00784ac25b31b",
  countryCode: "US",
  countryCodeSecret: "0xbf67cdde85f69044c61a434650eed458",
  countryCodeSignature:
    "0x573a465b7ad7560be114cb44f7614b814812ce23c853a56d062e4356867330c95f47dcc516c6064b7a66bebe61c46ba51f9942ee44a2a1f472b05de1a70c03f81c",
  firstName: "",
  firstNameSecret: "0x739c1aab74f5714355cc249bd1ffc919",
  firstNameSignature:
    "0x969fc80dfae3f1d90aac7d43893b9c7688ad6a1fff284b65d1b851e26d36d8984a6a7e3945cc9c21ae279a654a78618030459fde57a11e514f731f8fc90747b61c",
  lastName: "",
  lastNameSecret: "0xec4f423ffe4f36f019e6a68a615a34c3",
  lastNameSignature:
    "0x058074160307e78184aa5cb6beb7b972fbe4009d610f3ce1ff64be41f6ee2c717fa738c77aa00dc430d64ea28c1681f53aa7a73a58973e0fc16f2cf7c83c5d7c1b",
  middleInitial: "",
  middleInitialSecret: "0x1eb7e2813a78acce8bca1c8005cf83eb",
  middleInitialSignature:
    "0xb6cb993bac6269953332dec3b9fb05d8cadb05f8988d3d3d6d8fc55e03ef798c6dfb55687fe8193af2765dade476f81ec212ae8f20372d738f86a5dcefdc9f401c",
  postalCode: "",
  postalCodeSecret: "0x56cf9048b706dd4ae55add67d28cdc0c",
  postalCodeSignature:
    "0x573d1870bfb9d3ddd5fe699f967ea6e4cd3fd93b78d73e024b52218f42cd03322bf08c59eb4957fc8da97578c202da21bc12b32b2b3ac29a2eb4194086eb9d1f1c",
  streetAddr1: "",
  streetAddr1Secret: "0xe2175b24ce19f298a9a1ec473e50f5b0",
  streetAddr1Signature:
    "0x4952859162323656cba80542c558cae5bd5a93821a70918fcf4e63fc93bb409722416b0355b90a1a7422937ece57e5748bb9817c594eeb1f4cb9457a5c43fd3a1b",
  streetAddr2: "",
  streetAddr2Secret: "0xeaf199bf3ab73261905fe2dbc3c2f3f9",
  streetAddr2Signature:
    "0x8636c635b3c2cbec878ad44f57419596ddd7d56bc68e91c99bc42705703c24b5484ebbd7ae0a6f34b18f4e795b0f12117ed1b3d0d92b271756b05e025d183c701c",
  subdivision: "",
  subdivisionSecret: "0x85d21bd6370b148cf164b96b66f0f369",
  subdivisionSignature:
    "0x124bf38ced51d6b21af17b5d85250d2af83b5bbe5d930ba2aa7fa3f250d7962b736ed1b8d7d3446c2f0a6b3c0942d9c68a8105af75a08fcdd14132057cf41b441b",
};

// Display success message, and retrieve user credentials to store in browser
const Verified = () => {
  const [error, setError] = useState();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    getIsHoloRegistered().then((isRegistered) => setRegistered(isRegistered));
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
          await storeCredentials(credsTemp);
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
  //   city: "New York City",
  //   subdivision: "NY",
  //   countryCode: "US",
  //   postalCode: "789",
  //   birthdate: "1901-01-01",
  //   completedAt: "00:00:0000",
  //   serverSignature:
  //     "0x99261b497222b2b77198a77c3cbc7c3711a06e1f0f098c69559e69ae92c0f8cb570ceac17319719dd5aaf8fb83db952d537fe1d11abf4acba9a84ef5608132f01b",
  //   secret: "0x4dce2f407bc0599198c8af860417c5a5",
  // });
  storeCredentials(testCreds);

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
