import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const HalalScannerEnvSchema = z.object({
    HALAL_SCANNER_API_URL: z.string().min(1, "Halal Scanneer API  is required"),
    HALAL_SCANNER_BEARER_TOKEN: z.string().min(1, "Halal Scanneer Bearer Token is required")
});

export type HalalScannerConfig = z.infer<typeof HalalScannerEnvSchema>;

export async function validateHalalScannerConfig(
    runtime: IAgentRuntime
): Promise<HalalScannerConfig> {
    try {
        const config = {
            HALAL_SCANNER_API_URL: runtime.getSetting("HALAL_SCANNER_API_URL"),
            HALAL_SCANNER_BEARER_TOKEN: runtime.getSetting("HALAL_SCANNER_BEARER_TOKEN")
        };
        console.log('config: ', config)
        return HalalScannerEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error)
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `HadiCewAI API configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}