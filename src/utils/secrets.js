/**
 * Helpers for interacting with Holonym browser extension
 */

const extensionId = "jmaehplbldnmbeceocaopdolmgbnkoga";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/**
 * Request Holo creds from browser extension.
 */
export async function getHoloCredentials() {
  window.postMessage({ message: "getHoloCredentials" });
  for (let i = 0; i < 100; i++) {
    const credsEl = document.getElementById("injected-holonym-creds");
    if (credsEl && credsEl.textContent) {
      return credsEl.textContent;
    }
    await sleep(200);
  }
  return;
}

/**
 * Request from the Holo browser extension the user's public key.
 */
async function getPublicKey() {
  return new Promise((resolve) => {
    const message = { message: "getHoloPublicKey" };
    chrome.runtime.sendMessage(extensionId, message, (resp) => {
      console.log("secrets: Received public key...");
      console.log(resp);
      resolve(resp);
    });
  });
}

/**
 * @param {SubtleCrypto.JWK} publicKey
 * @param {string} message
 * @returns {Promise<string>} Encrypted message
 */
async function encrypt(publicKey, message = "hello world!") {
  const algo = {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  };
  let args = ["jwk", publicKey, algo, false, ["encrypt"]];
  const pubKeyAsCryptoKey = await window.crypto.subtle.importKey(...args);
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  args = ["RSA-OAEP", pubKeyAsCryptoKey, encodedMessage];
  const encryptedMessage = await window.crypto.subtle.encrypt(...args);
  return JSON.stringify(Array.from(new Uint8Array(encryptedMessage)));
}

async function encryptCredentials(decryptedCreds) {
  console.log("secrets: Getting public key");
  const encryptionKey = await getPublicKey();
  const stringifiedCreds = JSON.stringify(decryptedCreds);
  console.log("secrets: Encrypting credentials");
  const encryptedCreds = await encrypt(encryptionKey, stringifiedCreds);
  return encryptedCreds;
}

/**
 * Encrypt and store the provided credentials with the Holonym browser
 * @param {object} credentials creds object from Holonym server
 */
export async function storeCredentials(credentials) {
  const encryptedCreds = await encryptCredentials(credentials);
  console.log("secrets: Storing Holonym credentials");
  const payload = {
    message: "setHoloCredentials",
    credentials: encryptedCreds,
  };
  const callback = (resp) => {
    if (!resp.success) console.log("!resp.success"); // TODO: Better error handling
  };
  chrome.runtime.sendMessage(extensionId, payload, callback);
}

/**
 * Extract encrypted credentials from page, and request decryption from user
 * @returns Decrypted credentials object
 */
export async function getAndDecryptCredentials() {
  const encryptedCreds = await getHoloCredentials();
  if (!encryptedCreds) {
    return;
  }
  const accounts = await getAccounts();
  const decryptedCreds = await decrypt(accounts[0], encryptedCreds);
  return JSON.parse(decryptedCreds);
}
