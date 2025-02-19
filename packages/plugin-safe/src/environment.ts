import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const SafeEnvSchema = z.object({
    SAFE_ADDRESS: z.string().min(1, "SAFE_ADDRESS is required"),
    SIGNER_PRIVATE_KEY: z.string().min(1, "SIGNER_PRIVATE_KEY is required"),
    RPC_URL: z.string().min(1, "RPC_URL is required"),
});

export type SafeConfig = z.infer<typeof SafeEnvSchema>;

export async function validateSafeConfig(
    runtime: IAgentRuntime
): Promise<SafeConfig> {
    try {
        const config = {
            SAFE_ADDRESS: runtime.getSetting("SAFE_ADDRESS"),
            SIGNER_PRIVATE_KEY: runtime.getSetting("SIGNER_PRIVATE_KEY"),
            RPC_URL: runtime.getSetting("RPC_URL"),
        };
        console.log('config: ', config)
        return SafeEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error)
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Safe configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}