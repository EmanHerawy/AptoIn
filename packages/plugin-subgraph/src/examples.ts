import { ActionExample } from "@elizaos/core";

export const subgraphQueryExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "How many owners of this token are there?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me query the subgraph for the number of owners.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the total supply of this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will query the subgraph for the total supply.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Give me the token name and symbol",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will retrieve the token name and symbol from the subgraph in Eigenlayer.",
                action: "QUERY_TOKENS_INFO",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "How many transactions have been made on this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me query the subgraph for the transaction count.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "How many users have this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will query the subgraph for the number of users.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Top 10 users with the most tokens",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me query the subgraph for the top 10 active accounts in Eigenlayer.",
                action: "QUERY_ACTIVE_ACCOUNTS",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Retrieve the first 20 users record who bought this token",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will query the subgraph for the first 20 buyers.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Retrieve the first 20 users record who sold this token",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me query the subgraph for the first 20 sellers.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Retrieve the first 20 users record who bought and sold this token",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will query the subgraph for the first 20 buyers and sellers.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "How many users have this token in a particular day?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me query the subgraph for the daily user count.",
                action: "SUBGRAPH_QUERY",
            },
        }
    ],
]

