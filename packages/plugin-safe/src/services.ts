import { z } from "zod";
import Safe, {SafeConfig, SafeFactory ,SigningMethod } from "@safe-global/protocol-kit";

import { Chain, createPublicClient, http, Transaction } from "viem";
import {
  MetaTransactionData,
  SafeTransaction,
  TransactionResult,
} from "@safe-global/safe-core-sdk-types"; // Importing Safe transaction types from the Safe Core SDK

export const createSafeService = () => {
 
const getEthBalanceService = async ({ address, rpcUrl }) => {
    if (!address.startsWith("0x") || address.length !== 42) {
      throw new Error("Invalid address.");
    }
    
    const fetchedEthBalance = await fetch(
      `${rpcUrl}/api/v1/safes/${address}/balances/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      throw new Error("Error fetching data from the tx service:" + error);
    });
  
    const ethBalanceData = await fetchedEthBalance.json();
    const weiBalance = ethBalanceData.find(
      (element) => element?.tokenAddress === null && element?.token === null
    )?.balance;
    const ethBalance = BigInt(weiBalance) / BigInt(10 ** 18); // Convert from wei to eth
  
    return `The current balance of the Safe Multisig at address ${address} is ${ethBalance.toLocaleString(
      "en-US"
    )} ETH.`;
  };
  
   const deployNewSafeService = async (owners: string[], threshold: number, rpcUrl: string, signerPrivateKey: string, chain: Chain) => {
    const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
    const safeFactory = await SafeFactory.init({
      provider: rpcUrl, // The blockchain provider URL to connect to
      signer: signerPrivateKey, // The signer's private key to sign transactions
    });
    // Configure the Safe account
    const safeAccountConfig = {
      owners: owners, // List of owner addresses
      threshold: threshold, // Minimum number of required signatures
    };
    
    const protocolKit = await safeFactory.deploySafe({
      safeAccountConfig, // The Safe account configuration
      saltNonce: saltNonce.toString(), // A unique salt for this deployment
    });

    // Retrieve the address of the newly deployed Safe
    const safeAddress = await protocolKit.getAddress();

    return `A new Safe multisig was successfully deployed on Sepolia. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was ${saltNonce}.`;
  };
  
   const getEthBalanceServiceMetadata = {
    name: "getEthBalance",
    description:
      "Call to get the balance in ETH of a Safe Multisig for a given address and chain ID.",
    schema: z.object({
      address: z.string(),
      chainId: z.enum(["1"]),
    }),
  };
  
     const deployNewSafeServiceMetadata = {
    name: "deployNewSafe",
    description: "Call to deploy a new 1-1 Safe Multisig on Sepolia.",
    schema: z.object({}),
  };
     const executeTransactionViaSafeService = async (metaTransaction: MetaTransactionData,safeAddress: string, rpcUrl: string, signerPrivateKey: string, chain: Chain) => {
     
      const config:SafeConfig={
        provider: rpcUrl,
        signer: signerPrivateKey,
        safeAddress: safeAddress,
      }
      
      console.log({config});
   const safeSigner = await Safe.init(config);

      const safeClient = await safeSigner.getSafeProvider().getExternalSigner();

      let safeTransaction: SafeTransaction;
      try {
        safeTransaction = await safeSigner.createTransaction({
          transactions: [metaTransaction], // The list of meta-transactions to execute
        });
        console.info("Safe transaction created");
      } catch (error) {
        console.error("Failed to create Safe transaction", error);
        throw new Error("Failed to create Safe transaction");
      }
  
      // Sign the Safe transaction with the first Safe owner
      let signedSafeTransaction: SafeTransaction;
      try {
        signedSafeTransaction = await safeSigner.signTransaction(
          safeTransaction,
          SigningMethod.ETH_SIGN // Use ETH_SIGN as the signing method
        );
        console.info("Safe transaction signed by owner 1");
      } catch (error) {
        console.error("Failed to sign Safe transaction by owner 1", error);
        throw new Error("Failed to sign Safe transaction by owner 1");
      }
  };



  return { getEthBalanceService, deployNewSafeService, executeTransactionViaSafeService };
};



