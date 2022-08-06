/**
 * Helpers for interacting with MetaMask and Holonym browser extension
 */

import {bufferToHex as ethUtilBufferToHex} from 'ethereumjs-util';
import { encrypt as sigUtilEncrypt } from '@metamask/eth-sig-util';


// -----------------------------
// MetaMask helper functions
// -----------------------------

export async function getAccounts() {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts;
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log("Please connect to MetaMask.");
    } else {
      console.error(err);
    }
  }
}

export async function getEncryptionPublicKey(account) {
  try {
    const encryptionPubKey = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [account], // you must have access to the specified account
    });
    return encryptionPubKey;
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log("We can't encrypt anything without the key.");
    } else {
      console.error(err);
    }
  }
}

export async function encrypt(encryptionPubKey, message = "hello world!") {
  // const encryptedData = sigUtil.encrypt({
  const encryptedData = sigUtilEncrypt({
    publicKey: encryptionPubKey,
    data: message,
    version: "x25519-xsalsa20-poly1305",
  })
  const encryptedDataAsStr = JSON.stringify(encryptedData)
  return ethUtilBufferToHex(Buffer.from(encryptedDataAsStr, "utf8"));
}

export async function decrypt(account, encryptedMessage) {
  try {
    return await window.ethereum.request({
      method: "eth_decrypt",
      params: [encryptedMessage, account],
    });
  } catch (err) {
    console.log(err);
  }
}

// -----------------------------
// Holonym browser extension helper functions
// -----------------------------

/**
 * Request Holo creds from browser extension. 
 */
async function getHoloCredentials() {
  return new Promise((resolve) => {
    window.postMessage({ message: 'getHoloCredentials' });
    setTimeout(() => {
      const credsEl = document.getElementById('injected-holonym-creds');
      if (!credsEl) resolve();
      const credsStr = credsEl.textContent;
      if (credsStr) {
        resolve(credsStr);
      }
      resolve();
    }, 50);
  });
}

/**
 * Tell Holonym browser extension to store the provided credentials.
 * @param credentials
 */
function setHoloCredentials(credentials) {
  console.log('Posting message. Setting credentials')
  window.postMessage({
    message: "setHoloCredentials",
    credentials: credentials
  });
}

async function encryptCredentials(decryptedCreds) {
  const accounts = await getAccounts();
  const encryptionKey = await getEncryptionPublicKey(accounts[0]);
  const stringifiedCreds = JSON.stringify(decryptedCreds);
  const encryptedCreds = await encrypt(encryptionKey, stringifiedCreds);
  return encryptedCreds;
}

/**
 * Encrypt and store the provided credentials
 * @param {object} credentials creds object from Holonym server
 */
export async function storeCredentials(credentials) {
  const encryptedCreds = await encryptCredentials(credentials);
  setHoloCredentials(encryptedCreds);
}

/**
 * Extract encrypted credentials from page, and request decryption from user
 * @returns Decrypted credentials object
 */
export async function getAndDecryptCredentials() {
  const encryptedCreds = await getHoloCredentials();
  const accounts = await getAccounts();
  const decryptedCreds = await decrypt(accounts[0], encryptedCreds);
  return JSON.parse(decryptedCreds);
}

