import { ActionExample } from "@elizaos/core";

export const getSafeDeploymentExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Deploy a Safe for my account",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me deploy a Safe for your account. what are the owners? and what is the threshold? and what is the chain?",
                action: "DEPLOY_MULTISIG_WALLET",
                content: {
                    owners: ["0x123", "0x456"],
                    threshold: 2,
                    chain: "mainnet",
                },
            },
        }

    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the Safe address?",
                action: "DEPLOY_MULTISIG_WALLET",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "The Safe address is 0x1234567890",
                
            },
        }

        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the Safe deployment transaction?",
                },
            }, 
            {
                user: "{{agent}}",
                content: {
                    text: "The Safe deployment transaction is 0x1234567890",
                },
            }

        ]
   
]


export const getSafeExecutionExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Send 1000 USDC to 0x1234567890 on mainnet",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me execute a Safe transaction for you. what is the Safe address?",
                action: "EXECUTE_SAFE_TRANSACTION",
                content: {
                    to: "0x1234567890",
                    token: "USDC",
                    value: "1000",
                    chain: "mainnet",
                },
            },
        }

    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "send 0.001 ETH  on arbitrum one",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me execute a Safe transaction for you. what is the Safe address? and what is the recipient address?",
                action: "EXECUTE_SAFE_TRANSACTION",
                content: {
                    to: "0x1234567890",
                    token: "",
                    value: "0.001",
                    chain: "arbitrum one",
                },
            },
        }

        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the Safe execution transaction?",
                },
            }, 
            {
                user: "{{agent}}",
                content: {
                    text: "The Safe deployment transaction is 0x1234567890",
                },
            }

        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the balance of my Safe?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "The balance of your Safe is 1000 USDC",
                },
            }
        ]

   
]
