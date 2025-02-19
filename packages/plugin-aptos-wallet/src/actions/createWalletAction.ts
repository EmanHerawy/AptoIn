import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { validateAptosConfig } from "../environment";
import { getAptosDeploymentExamples } from "../examples";
import { createAptosWalletService } from "../services";



export const createAptosWalletAction: Action = {
    name: "CREATE_APTOS_WALLET",
    similes: [
        "CREATE_APTOS_WALLET",
        "LOGIN_APTOS_WALLET",
        "CREATE_APTOS_WALLET_ACCOUNT",
        "CREATE_APTOS_WALLET_ACCOUNT_VIA_GOOGLE",

      
    ],
    description: "Create a new Aptos wallet.",
    validate: async (runtime: IAgentRuntime) => {
        await validateAptosConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateAptosConfig(runtime);
        console.log("config in create wallet action", config);
        
        // Check if the required properties exist
        if (!config.APTOS_PRIVATE_KEY || !config.CLIENT_SECRET) {
            elizaLogger.error("Missing APTOS_PRIVATE_KEY or APTOS_NETWORK in the config");
            callback({
                text: "Configuration error: Missing API key or UUID.",
                content: { error: "Missing APTOS_PRIVATE_KEY or APTOS_NETWORK" },
            });
            return false;
        }
     
  
                const aptosService = createAptosWalletService();

        try {
            const aptosWallet = await aptosService.ConnectToGoogleService();
            elizaLogger.success(
                `Successfully created Aptos wallet`
            );
            if (callback) {
                callback({
                    text: `<a href="${aptosWallet}" class="button">Sign in</a>`
                });
                return true;
            }
        } catch (error:any) {
            elizaLogger.error("Error in Aptos plugin handler:", error);
            callback({
                text: `Error creating Aptos wallet: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getAptosDeploymentExamples as ActionExample[][],
} as Action;


