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
import { validateTheGraphConfig } from "../environment";
import { subgraphQueryExamples } from "../examples";
import { createTheGraphService } from "../services";
import { TokenContentSchema, TokenContentScemaType, TokenOwnershipTransferResponse, TokenQueryResponse, TokenQueryResponses } from "../types";
import { subgraphQueryTemplate } from "../templates";

export const isTokenContent = (
    object: any
): object is TokenContentScemaType => {
    if (TokenContentSchema.safeParse(object).success) {
        return true;
    }
    return false;
};

export const queryActiveAccountsAction: Action = {
    name: "QUERY_ACTIVE_ACCOUNTS",
    similes: [
        "QUERY_ACTIVE_ACCOUNTS",
        "INDEXING",
        "QUERY",
        "GRAPHQL",
        "THE_GRAPH",
        "SUBSTREAMS"
    ],
    description: "Query the subgraph for the active accounts in Eigenlayer.",
    validate: async (runtime: IAgentRuntime) => {
        await validateTheGraphConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateTheGraphConfig(runtime);

        // Check if the required properties exist
        if (!config.THE_GRAPH_API_KEY || !config.THE_GRAPH_SUBGRAPH_ID) {
            elizaLogger.error("Missing THE_GRAPH_API_KEY in config");
            callback({
                text: "Configuration error: Missing API key for the subgraph.",
                content: { error: "Missing THE_GRAPH_API_KEY" },
            });
            return false;
        }
        // @notice @ethglobal team , we had to use this instead of our subgraph url because the subgraph url is not working 
        const APIURL = `https://gateway.thegraph.com/api/${config.THE_GRAPH_API_KEY}/subgraphs/id/${config.THE_GRAPH_SUBGRAPH_ID}`
        //    const APIURL = `https://gateway-testnet-arbitrum.network.thegraph.com/api/${config.THE_GRAPH_API_KEY}/subgraphs/id/${config.THE_GRAPH_SUBGRAPH_ID}`
        const query = `{
               activeAccounts (first: 10){
                    id
                    deposits {
                    amount
                    amountUSD
                    from
                    }
                    withdraws(first: 10) {
                    amount
                    amountUSD
                    }
                }
            }`
        const theGraphService = createTheGraphService(
            query,
            APIURL,
        );

        try {
            const subgraphData = await theGraphService.queryTheGraph();
            console.log({ subgraphData });

            elizaLogger.success(
                `Successfully fetched subgraph data`
            );
            if (callback) {
                callback({
                    text: `Here is the subgraph data:\n${formatSubgraphData(subgraphData)}`
                });
                return subgraphData;
            }
        } catch (error: any) {
            elizaLogger.error("Error in Subgraph plugin handler:", error);
            callback({
                text: `Error fetching subgraph data: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: subgraphQueryExamples as ActionExample[][],
} as Action;

export const queryTokensInfoAction: Action = {
    name: "QUERY_TOKENS_INFO",
    similes: [
        "QUERY_TOKENS_INFO",
        "TOKEN_SYMBOLS",
        "TOKEN_INFORMATION",
        "TOKEN_NAME"
    ],
    description: "Query the subgraph for the token information in Eigenlayer.",
    validate: async (runtime: IAgentRuntime) => {
        await validateTheGraphConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateTheGraphConfig(runtime);

        // Check if the required properties exist
        if (!config.THE_GRAPH_API_KEY || !config.THE_GRAPH_SUBGRAPH_ID) {
            elizaLogger.error("Missing THE_GRAPH_API_KEY in config");
            callback({
                text: "Configuration error: Missing API key for the subgraph.",
                content: { error: "Missing THE_GRAPH_API_KEY" },
            });
            return false;
        }
        // @notice @ethglobal team , we had to use this instead of our subgraph url because the subgraph url is not working 
        const APIURL = `https://gateway.thegraph.com/api/${config.THE_GRAPH_API_KEY}/subgraphs/id/${config.THE_GRAPH_SUBGRAPH_ID}`
        //    const APIURL = `https://gateway-testnet-arbitrum.network.thegraph.com/api/${config.THE_GRAPH_API_KEY}/subgraphs/id/${config.THE_GRAPH_SUBGRAPH_ID}`
        const query = `{
               tokens(first: 10) {
                id
                name
                symbol
                decimals
                }
            }`
        const theGraphService = createTheGraphService(
            query,
            APIURL,
        );

        try {
            const subgraphData = await theGraphService.queryTheGraph();
            console.log({ subgraphData });

            elizaLogger.success(
                `Successfully fetched subgraph data`
            );
            if (callback) {
                callback({
                    text: `Here is the subgraph data:\n${formatTokens(subgraphData)}`
                });
                return subgraphData;
            }
        } catch (error: any) {
            elizaLogger.error("Error in Subgraph plugin handler:", error);
            callback({
                text: `Error fetching subgraph data: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: subgraphQueryExamples as ActionExample[][],
} as Action;

export const querySubgraphAction: Action = {
    name: "SUBGRAPH_QUERY",
    similes: [
        "SUBGRAPH_QUERY",
        "INDEXING",
        "QUERY",
        "GRAPHQL",
        "THE_GRAPH",
        "SUBSTREAMS"
    ],
    description: "Query the subgraph for the token information.",
    validate: async (runtime: IAgentRuntime) => {
        await validateTheGraphConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateTheGraphConfig(runtime);

        // Check if the required properties exist
        if (!config.THE_GRAPH_API_KEY || !config.THE_GRAPH_SUBGRAPH_ID) {
            elizaLogger.error("Missing THE_GRAPH_API_KEY in config");
            callback({
                text: "Configuration error: Missing API key for the subgraph.",
                content: { error: "Missing THE_GRAPH_API_KEY" },
            });
            return false;
        }
        // @notice @ethglobal team , we had to use this instead of our subgraph url because the subgraph url is not working 
        const APIURL = `https://gateway.thegraph.com/api/${config.THE_GRAPH_API_KEY}/subgraphs/id/${config.THE_GRAPH_SUBGRAPH_ID}`
        //    const APIURL = `https://gateway-testnet-arbitrum.network.thegraph.com/api/${config.THE_GRAPH_API_KEY}/subgraphs/id/${config.THE_GRAPH_SUBGRAPH_ID}`
        const query = `{
               activeAccounts (first: 10){
                    id
                    deposits {
                    amount
                    amountUSD
                    from
                    }
                    withdraws(first: 10) {
                    amount
                    amountUSD
                    }
                }
            }`
        const theGraphService = createTheGraphService(
            query,
            APIURL,
        );

        try {
            const subgraphData = await theGraphService.queryTheGraph();
            console.log({ subgraphData });

            elizaLogger.success(
                `Successfully fetched subgraph data`
            );
            if (callback) {
                callback({
                    text: `Here is the subgraph data:\n${formatSubgraphData(subgraphData)}`
                });
                return subgraphData;
            }
        } catch (error: any) {
            elizaLogger.error("Error in Subgraph plugin handler:", error);
            callback({
                text: `Error fetching subgraph data: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: subgraphQueryExamples as ActionExample[][],
} as Action;

export const getMissingTokenContent = (
    content: Partial<TokenContentScemaType>
): string => {
    const missingFields = [];

    if (typeof content !== "string")
        missingFields.push("query");

    return missingFields.join(" and ");
};

const formatSubgraphData = (data: any): string => {
    let output = '';

    data.activeAccounts.forEach((account: any) => {
        const accountInfo = `Account ID: ${account.id}\n`;
        const depositsInfo = account.deposits.map((deposit: any) => {
            return `  - Deposit Amount: ${deposit.amount}, Deposit Amount USD: ${deposit.amountUSD}, From: ${deposit.from}`;
        }).join("\n");

        output += accountInfo + (depositsInfo || '  - No deposits available') + '\n\n';
    });

    return output.trim(); // Remove any trailing whitespace
};

const formatPoolBalances = (data: any): string => {
    let output = '';

    data.accounts.forEach((account: any) => {
        const accountInfo = `Account ID: ${account.id}\n`;
        const poolBalancesInfo = account.poolBalances.map((balance: any) => {
            return `  - Pool Balance: ${balance.amount}, Pool Balance USD: ${balance.amountUSD}`;
        }).join("\n");

        output += accountInfo + (poolBalancesInfo || '  - No pool balances available') + '\n\n';
    });

    return output.trim(); // Remove any trailing whitespace
};


const formatTokens = (data: any): string => {
    let output = '';

    data.tokens.forEach((token: any) => {
        const tokenInfo = `Token ID: ${token.id}, Name: ${token.name}, Symbol: ${token.symbol}, Decimals: ${token.decimals}\n`;
        output += tokenInfo;
    });

    return output.trim(); // Remove any trailing whitespace
};