import { z } from "zod";

export const TokenContentSchema = z.object({
    tokenName: z.string(),
    agentTaskId: z.string()
});

export type TokenContentScemaType = z.infer<typeof TokenContentSchema>;

export interface HalalScannerResponse {
    IsHalal: boolean;
    justification: string;
    riskAssessment: string;
}


