import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    generateObject,
    composeContext,
} from "@elizaos/core";
import { validateSafeConfig } from "../environment";
import { getSafeExecutionExamples } from "../examples";
import { createSafeService } from "../services";
import { OperationType, MetaTransactionData } from "@safe-global/types-kit";
import { SafeExecutionInputSchema, SafeExecutionInputType } from "../types";
import { safeExecuteTemplate } from "../templates";
import { Chain, Transaction } from "viem";
import { ethers } from "ethers";
export const isSafeExecutionInput = (
    object: any
): object is SafeExecutionInputType => {
    console.log({object});
    
    if (SafeExecutionInputSchema.safeParse(object).success) {
        return true;
    }
    return false;
};

export const executeSafeTransactionAction: Action = {
    name: "EXECUTE_SAFE_TRANSACTION",
    similes: [
        "EXECUTE_SAFE_TRANSACTION",
        "SIGN_SAFE_TRANSACTION",
        "CREATE_SAFE_TRANSACTION",
        "EXECUTE_MULTISIG_TRANSACTION",
        "EXECUTE_SAFE_MULTISIG_TRANSACTION",
        "EXECUTE_MULTISIG_SAFE_TRANSACTION",
        "EXECUTE_WALLET",
        "EXECUTE_MULTISIG_WALLET",
        "EXECUTE_SAFE_WALLET",
        "EXECUTE_WALLET_SAFE",
        "EXECUTE_WALLET_MULTISIG",
      
    ],
    description: "Execute a transaction on a Safe wallet.",
    validate: async (runtime: IAgentRuntime) => {
        await validateSafeConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateSafeConfig(runtime);
        console.log({config});
        
        // Check if the required properties exist
        if (!config.SIGNER_PRIVATE_KEY || !config.RPC_URL) {
            elizaLogger.error("Missing SIGNER_PRIVATE_KEY or RPC_URL in the config");
            callback({
                text: "Configuration error: Missing API key or UUID.",
                content: { error: "Missing SIGNER_PRIVATE_KEY or RPC_URL" },
            });
            return false;
        }
        const context = composeContext({
            state,
            template: safeExecuteTemplate,
        });

// Generates structured objects from a prompt using specified AI models and configuration options.

        const content = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            schema: SafeExecutionInputSchema,
        });

        if (!isSafeExecutionInput(content.object)) {
            const missingFields = getMissingSafeTransactionInput(
                content.object
            );
            callback({
                text: `Need more information about the swap. Please provide me ${missingFields}`,
            });
            return;
        }

        // Check if tokenName exists in content
        if (!content.object.to|| !content.object.value || !content.object.chain ) {
            callback({
                text: "Missing to, value, or chain in the content.",
                content: { error: "Missing to, value, or chain" },
            });
            return;
        }

        // if (!isValideChain(content.object.chain)) {
        //     callback({
        //         text: "Invalid chain.",
        //         content: { error: "Invalid chain" },
        //     });
        //     return;
        // }
        if (!isValideAddress(content.object.to)) {
            callback({
                text: "Invalid to.",
                content: { error: "Invalid to" },
            });
            return;
        }
      
        const safeService = createSafeService();

        try {
            // if token is not empty, it means we are sending native ether
            // isValideAddress(content.object.token)
            const safeTx: MetaTransactionData = {
                to: content.object.to,
                value: content.object.value,
                data: "0x",
                operation: OperationType.Call,
              };
            const safeDeployment = await safeService.executeTransactionViaSafeService(
                safeTx,
                config.SAFE_ADDRESS,
                config.RPC_URL,
                config.SIGNER_PRIVATE_KEY,
                content.object.chain as unknown as Chain
            );
            elizaLogger.success(
                `Successfully executed transaction on Safe`
            );
            if (callback) {
                callback({
                    text: `Here is the Safe deployment: ${safeDeployment}`
                });
                return true;
            }
        } catch (error:any) {
            elizaLogger.error("Error in SAFE plugin handler:", error);
            callback({
                text: `Error deploying Safe: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getSafeExecutionExamples as ActionExample[][],
} as Action;

export const getMissingSafeTransactionInput = (
    content: Partial<SafeExecutionInputType>
): string => {
    const missingFields = [];

    if (typeof content.chain !== "string")
        missingFields.push("chain");
    if (typeof content.to !== "string")
        missingFields.push("transaction");
   
    return missingFields.join(" and ");
};
export const isValideAddress = (address: string) => {
    return ethers.utils.isAddress(address);
};

export const isValideThreshold = (threshold: number) => {
    return threshold > 0 && threshold <= 10;
};

export const isValideChain = (chain: string) => {
    return chain === "mainnet" || chain === "sepolia" || chain === "polygon" || chain === "arbitrum" || chain === "avalanche" || chain === "base" || chain === "bsc" || chain === "fantom" || chain === "gnosis" || chain === "optimism" || chain === "polygon" || chain === "solana" || chain === "xdai";
};
