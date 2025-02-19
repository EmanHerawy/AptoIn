import { z } from "zod";
import { Chain } from "viem";

export const TokenContentSchema = z.object({
    tokenName: z.string()
});

export const SafeDeploymentInputSchema = z.object({
    owners: z.array(z.string()),
    threshold: z.number(),
    chain: z.string()
});

export const SafeExecutionInputSchema = z.object({
    to: z.string(),
    token: z.string(),
    value: z.string(),
    chain: z.string(),
});

export type TokenContentScemaType = z.infer<typeof TokenContentSchema>;
export type SafeDeploymentInputType = z.infer<typeof SafeDeploymentInputSchema>;
export type SafeExecutionInputType = z.infer<typeof SafeExecutionInputSchema>;

export interface safeExecutionInput {
    to: string;
    token: string;
    value: string;
    chain: Chain;
}
export interface safeDeploymentInput {
    owners: string[];
    threshold: number;
    chain: Chain;
}
export interface SafeDeploymentResponse {
    safeAddress: string;
    deploymentTransaction: string;
}

export interface SafeExecutionResponse {
    safeAddress: string;
    executionTransaction: string;
}

export interface SafeBalanceResponse {
    balance: string;
    token: string;
    walletAddress: string;
}   
    


