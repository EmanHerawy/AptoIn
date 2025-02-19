import { ActionExample } from "@elizaos/core";

export const getAptosDeploymentExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Create a Aptos wallet for my account",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me deploy a Aptos wallet for your account. You need to connect your google account to create a wallet",
                action: "CREATE_APTOS_WALLET",
               
            },
        }

    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Login to my Aptos wallet",
                action: "LOGIN_APTOS_WALLET",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "You are logged in to your Aptos wallet",
                
            },
        }

         ]
   
]

