import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const TheGraphEnvSchema = z.object({
    THE_GRAPH_API_KEY: z.string().min(1, "The Graph API key is required"),
    THE_GRAPH_SUBGRAPH_ID: z.string().min(1, "The Graph Subgraph ID is required"),
});

export type TheGraphConfig = z.infer<typeof TheGraphEnvSchema>;

export async function validateTheGraphConfig(
    runtime: IAgentRuntime
): Promise<TheGraphConfig> {
    try {
        const config = {
            THE_GRAPH_API_KEY: runtime.getSetting("THE_GRAPH_API_KEY"),
            THE_GRAPH_SUBGRAPH_ID: runtime.getSetting("THE_GRAPH_SUBGRAPH_ID"),
        };
        console.log('config: ', config)
        return TheGraphEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error)
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `The Graph configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}