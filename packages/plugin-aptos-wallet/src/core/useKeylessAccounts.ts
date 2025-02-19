// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import {
  EphemeralKeyPair,
  KeylessAccount,
  ProofFetchStatus,
} from "@aptos-labs/ts-sdk";
import { LocalStorageKeys, devnetClient } from "./constants";
import { validateIdToken } from "./idToken";
import {
  EphemeralKeyPairEncoding,
  isValidEphemeralKeyPair,
  validateEphemeralKeyPair,
} from "./ephemeral";
import { EncryptedScopedIdToken } from "./types";
import { KeylessAccountEncoding, validateKeylessAccount } from "./keyless";

interface AccountData {
  idToken: { decoded: EncryptedScopedIdToken; raw: string };
  pepper: Uint8Array;
}

class KeylessAccountsManager {
  private accounts: AccountData[] = [];
  private activeAccount?: KeylessAccount;
  private ephemeralKeyPair?: EphemeralKeyPair;
  private storage = new Map<string, string>(); // In-memory storage

  private saveToStorage() {
    const data = JSON.stringify({
      accounts: this.accounts,
      activeAccount: this.activeAccount
        ? KeylessAccountEncoding.encode(this.activeAccount)
        : undefined,
      ephemeralKeyPair: this.ephemeralKeyPair
        ? EphemeralKeyPairEncoding.encode(this.ephemeralKeyPair)
        : undefined,
    });
    console.log("Saving to storage:", data);
    this.storage.set("keylessAccounts", data);
  }

  private loadFromStorage() {
    const data = this.storage.get("keylessAccounts");
    if (data) {
      console.log("Loading from storage:", data);
      const parsed = JSON.parse(data);
      this.accounts = parsed.accounts || [];
      this.activeAccount = parsed.activeAccount
        ? validateKeylessAccount(KeylessAccountEncoding.decode(parsed.activeAccount))
        : undefined;
      this.ephemeralKeyPair = parsed.ephemeralKeyPair
        ? validateEphemeralKeyPair(EphemeralKeyPairEncoding.decode(parsed.ephemeralKeyPair))
        : undefined;
      console.log("Loaded ephemeral key pair:", this.ephemeralKeyPair);
    }
  }

  commitEphemeralKeyPair(account: EphemeralKeyPair) {
    if (!isValidEphemeralKeyPair(account)) {
      throw new Error("Invalid ephemeral key pair provided");
    }
    console.log("Setting ephemeral key pair:", account);
    this.ephemeralKeyPair = account;
    this.saveToStorage();
  }

  disconnectKeylessAccount() {
    console.log("Disconnecting keyless account");
    this.activeAccount = undefined;
    this.saveToStorage();
  }

  getEphemeralKeyPair(): EphemeralKeyPair | undefined {
    console.log("Retrieving ephemeral key pair:", this.ephemeralKeyPair);
    return this.ephemeralKeyPair ? validateEphemeralKeyPair(this.ephemeralKeyPair) : undefined;
  }

  async switchKeylessAccount(idToken: string): Promise<KeylessAccount | undefined> {
    this.activeAccount = undefined;
    this.saveToStorage();

    const decodedToken = validateIdToken(idToken);
    if (!decodedToken) {
      throw new Error("Invalid idToken provided, could not decode");
    }

    console.log("Decoded ID Token:", decodedToken);

    const ephemeralKeyPair = this.getEphemeralKeyPair();
    if (!ephemeralKeyPair || ephemeralKeyPair.nonce !== decodedToken.nonce) {
      throw new Error("Ephemeral key pair not found or mismatched");
    }

    console.log("Using ephemeral key pair:", ephemeralKeyPair);

    const proofFetchCallback = async (res: ProofFetchStatus) => {
      if (res.status === "Failed") {
        console.warn("Proof fetch failed, disconnecting account");
        this.disconnectKeylessAccount();
      } else {
        this.loadFromStorage();
      }
    };

    const storedAccount = this.accounts.find(
      (a) => a.idToken.decoded.sub === decodedToken.sub
    );

    let activeAccount: KeylessAccount | undefined;
    try {
      activeAccount = await devnetClient.deriveKeylessAccount({
        ephemeralKeyPair,
        jwt: idToken,
        proofFetchCallback,
      });
    } catch (error) {
      console.error("Error deriving keyless account:", error);
      if (!storedAccount?.pepper) throw error;
      activeAccount = await devnetClient.deriveKeylessAccount({
        ephemeralKeyPair,
        jwt: idToken,
        pepper: storedAccount.pepper,
        proofFetchCallback,
      });
    }

    if (activeAccount) {
      const { pepper } = activeAccount;
      this.accounts = storedAccount
        ? this.accounts.map((a) =>
            a.idToken.decoded.sub === decodedToken.sub
              ? { idToken: { decoded: decodedToken, raw: idToken }, pepper }
              : a
          )
        : [...this.accounts, { idToken: { decoded: decodedToken, raw: idToken }, pepper }];
      this.activeAccount = activeAccount;
      this.saveToStorage();
    }

    return activeAccount;
  }
}

export const keylessAccountsManager = new KeylessAccountsManager();
