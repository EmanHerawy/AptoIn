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
import { getSafeDeploymentExamples } from "../examples";
import { createSafeService } from "../services";
import { TokenContentSchema, SafeDeploymentInputType, SafeDeploymentInputSchema } from "../types";
import { safeDeploymentTemplate } from "../templates";
import { Chain } from "viem";
import { ethers } from "ethers";
export const isSafeDeploymentInput = (
    object: any
): object is SafeDeploymentInputType => {
    console.log("object in safe deployment", object);
    
    if (SafeDeploymentInputSchema.safeParse(object).success) {
        return true;
    }
    return false;
};

export const deploySafeAction: Action = {
    name: "DEPLOY_MULTISIG_WALLET",
    similes: [
        "DEPLOY_SAFE",
        "DEPLOY_MULTISIG",
        "DEPLOY_SAFE_MULTISIG",
        "DEPLOY_MULTISIG_SAFE",
        "DEPLOY_WALLET",
        "DEPLOY_MULTISIG_WALLET",
        "DEPLOY_SAFE_WALLET",
        "DEPLOY_WALLET_SAFE",
        "DEPLOY_WALLET_MULTISIG",
      
    ],
    description: "Deploy a new Safe wallet.",
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
            template: safeDeploymentTemplate,
        });

// Generates structured objects from a prompt using specified AI models and configuration options.

        const content = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            schema: SafeDeploymentInputSchema,
        });

        if (!isSafeDeploymentInput(content.object)) {
            const missingFields = getMissingSafeDeploymentInput(
                content.object
            );
            callback({
                text: `Need more information about the Safe deployment. Please provide me ${missingFields}`,
            });
            return;
        }
        // Check if tokenName exists in content
        if (!content.object.owners || !content.object.threshold || !content.object.chain ) {
            callback({
                text: "Missing owners, threshold, or chain in the content.",
                content: { error: "Missing owners, threshold, or chain" },
            });
            return;
        }

        if (!isValideOwnerList(content.object.owners)) {
            callback({
                text: "Invalid owner list.",
                content: { error: "Invalid owner list" },
            });
            return;
        }
        if (!isValideThreshold(content.object.threshold)) {
            callback({
                text: "Invalid threshold.",
                content: { error: "Invalid threshold" },
            });
            return;
        }
        // Check if the provided chain is valid
        if (!isValideChain(content.object.chain)) {
            // If the chain is invalid, notify the user and exit the function
            callback({
                text: "Invalid chain.",
                content: { error: "Invalid chain" },
            });
            return;
        }
          // Validate the threshold
    // The threshold must be at least 1 and cannot exceed the number of owners
    if (content.object.threshold < 1 || content.object.threshold  > content.object.owners.length) {
      
        throw new Error(
          `Invalid threshold: ${content.object.threshold } - Cannot be less than 1 or greater than the number of owners (${content.object.owners.length})`
        );
      }
  
        const safeService = createSafeService();

        try {
            const safeDeployment = await safeService.deployNewSafeService(
                content.object.owners,
                content.object.threshold,
                config.RPC_URL,
                config.SIGNER_PRIVATE_KEY,
                content.object.chain as unknown as Chain
            );
            elizaLogger.success(
                `Successfully deployed Safe`
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
    examples: getSafeDeploymentExamples as ActionExample[][],
} as Action;

export const getMissingSafeDeploymentInput = (
    content: Partial<SafeDeploymentInputType>
): string => {
    const missingFields = [];
    console.log("content in safe deployment", content);
    if (typeof content.chain !== "string")
        missingFields.push("chain");
    if (typeof content.owners !== "string")
        missingFields.push("owners");
    if (typeof content.threshold !== "number")
        missingFields.push("threshold");
   
    return missingFields.join(" and ");
};
export const isValideOwnerAddress = (address: string) => {
    return ethers.utils.isAddress(address);
};
export const isValideOwnerList = (owners: string[]) => {
    return owners.every(isValideOwnerAddress);
};

export const isValideThreshold = (threshold: number) => {
    return threshold > 0 && threshold <= 10;
};

export const isValideChain = (chain: string) => {
    return chain === "mainnet" || chain === "sepolia" || chain === "polygon" || chain === "arbitrum" || chain === "avalanche" || chain === "base" || chain === "bsc" || chain === "fantom" || chain === "gnosis" || chain === "optimism" || chain === "polygon" || chain === "solana" || chain === "xdai";
};
