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
import { validateHalalScannerConfig } from "../environment";
import { getHalalScannerExamples } from "../examples";
import { createHalalScannerService } from "../services";
import { TokenContentSchema, TokenContentScemaType } from "../types";
import { halalScannerTemplate } from "../templates";

export const isTokenContent = (
    object: any
): object is TokenContentScemaType => {
    if (TokenContentSchema.safeParse(object).success) {
        return true;
    }
    return false;
};

export const getTokenStatusAction: Action = {
    name: "HALAL_TOKEN_ASSESSMENT",
    similes: [
        "HALAL",
        "ISLAMIC",
        "SHARIA",
        "ISLAMIC_LAW",
        "ISLAMIC_FINANCE",
        "ISLAMIC_LAW",
        "ISLAMIC_FINANCE",
        "ISLAMIC_DEFI",
        "ISLAMIC_CRYPTO",
        "ISLAMIC_BLOCKCHAIN",
        "ISLAMIC_FINTECH",
        "ISLAMIC_FINTECH",
        "ISLAMIC_FINTECH",
    ],
    description: "Get the halal status of a token.",
    validate: async (runtime: IAgentRuntime) => {
        await validateHalalScannerConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateHalalScannerConfig(runtime);
        
        // Check if the required properties exist
        if (!config.HALAL_SCANNER_API_URL) {
            elizaLogger.error("Missing HALAL_SCANNER_API_URL in the config");
            callback({
                text: "Configuration error: Missing API key or UUID.",
                content: { error: "Missing HALAL_SCANNER_API_KEY or HALAL_SCANNER_UUID" },
            });
            return false;
        }
        const context = composeContext({
            state,
            template: halalScannerTemplate,
        });

// Generates structured objects from a prompt using specified AI models and configuration options.

        const content = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            schema: TokenContentSchema,
        });

        if (!isTokenContent(content.object)) {
            const missingFields = getMissingTokenContent(
                content.object
            );
            callback({
                text: `Need more information about the swap. Please provide me ${missingFields}`,
            });
            return;
        }

        // Check if tokenName exists in content
        if (!content.object.tokenName) {
            callback({
                text: "Missing token name in the content.",
                content: { error: "Missing token name" },
            });
            return;
        }

        const halalScannerService = createHalalScannerService(
            content.object.tokenName,
            config.HALAL_SCANNER_API_URL,
            config.HALAL_SCANNER_BEARER_TOKEN,
            content.object.agentTaskId 
        );

        try {
            const response = await halalScannerService.checkTokenForHalalCompliance();
            elizaLogger.success(
                `Successfully fetched halal status`
            );
            if (callback) {
                if (content.object.agentTaskId) {
                    callback({
                        text: `Here is the halal status of the token:${JSON.stringify(response)}`,
                    });
                }
                else {
                    callback({
                        text: `CrewAI Agent Task has been created, it would take a few minutes to complete. You can use the following id to get the status after it is completed: ${JSON.stringify(response)}`

                    });
                }
                return true;
            }
        } catch (error:any) {
            elizaLogger.error("Error in HALAL SCANNER plugin handler:", error);
            callback({
                text: `Error fetching HALAL SCANNER: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getHalalScannerExamples as ActionExample[][],
} as Action;

export const getMissingTokenContent = (
    content: Partial<TokenContentScemaType>
): string => {
    const missingFields = [];

    if (typeof content.tokenName !== "string")
        missingFields.push("token name");
   
    return missingFields.join(" and ");
};
