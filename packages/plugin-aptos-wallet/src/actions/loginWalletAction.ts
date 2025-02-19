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



export const loginAptosWalletAction: Action = {
    name: "APROS_LOGIN",
    similes: [
        "LOGIN_APTOS_WALLET",
    

      
    ],
    description: "Login to Aptos wallet.",
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
            const idToken = message.content.idToken;
            const aptosWallet = await aptosService.handleLoginCallback(idToken as any);
            return aptosWallet;
        } catch (error:any) {
            elizaLogger.error("Error in Aptos plugin login handler:", error);
            callback({
                text: `Error creating Aptos wallet: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: [],
} as Action;


