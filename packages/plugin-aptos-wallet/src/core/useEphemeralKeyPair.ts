// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { createEphemeralKeyPair } from "./ephemeral";
import { keylessAccountsManager } from "./useKeylessAccounts";

export default function useEphemeralKeyPair() {
  const { commitEphemeralKeyPair, getEphemeralKeyPair } = keylessAccountsManager;

  let keyPair = getEphemeralKeyPair();

  // If no key pair is found, create a new one and commit it to the store
  if (!keyPair) {
    keyPair = createEphemeralKeyPair();
    commitEphemeralKeyPair(keyPair);
  }

  return keyPair;
}
