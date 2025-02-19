import { z } from "zod";

export const TokenContentSchema = z.object({
    tokenName: z.string()
});

export type TokenContentScemaType = z.infer<typeof TokenContentSchema>;

export interface TokenTransferResponse {
       blockNumber: number;
    blockTimestamp: number;
    from: string;
    id: string;
    to: string;
    transactionHash: string;
    value: string;
 
}
export interface TokenQueryResponses {
    tokens: TokenQueryResponse[];
}
export interface TokenQueryResponse {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
}

export interface TokenApprovalResponse {
    id: string;
    owner: string;
    spender: string;
    transactionHash: string;
    value: string;
}

export interface TokenOwnershipTransferResponse {
    blockNumber: number;
    blockTimestamp: number;
    id: string;
    newOwner: string;
    previousOwner: string;
    transactionHash: string;
}