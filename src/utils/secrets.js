/**
 * Helpers for interacting with Holonym browser extension
 */

const extensionId = "jmaehplbldnmbeceocaopdolmgbnkoga";

/**
 * Request from the Holo browser extension the user's public key.
 */
async function getPublicKey() {
  return new Promise((resolve) => {
    const message = { message: "getHoloPublicKey" };
    chrome.runtime.sendMessage(extensionId, message, (resp) => {
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
  const encryptionKey = await getPublicKey();
  const stringifiedCreds = JSON.stringify(decryptedCreds);
  const encryptedCreds = await encrypt(encryptionKey, stringifiedCreds);
  return encryptedCreds;
}

/**
 * Encrypt and store the provided credentials with the Holonym browser
 * @param {object} credentials creds object from Holonym server
 */
export async function storeCredentials(credentials) {
  const encryptedCreds = await encryptCredentials(credentials);
  const payload = {
    message: "setHoloCredentials",
    credentials: encryptedCreds,
  };
  const callback = (resp) => {
    if (!resp.success) console.log("!resp.success"); // TODO: Better error handling
  };
  chrome.runtime.sendMessage(extensionId, payload, callback);
}

// TODO: Handle case where user hasn't registered prior to
// attempting to store credentials
