export const safeDeploymentTemplate = `Look at your LAST RESPONSE in the conversation where you ask about deploying a Safe multisig wallet.   

For example:
- "Deploy a Safe controled by the following owners: 0x123, 0x456, 0x789, and the threshold is 2 on ethereum mainnet" -> { "owners": ["0x123", "0x456", "0x789"], "threshold": 2, "chain": "mainnet" } 

\`\`\`json
{
    "owners": ["<owner1>", "<owner2>", "<owner3>"],
    "threshold": <threshold>,
    "chain": "<chain>"
}
\`\`\`

Note:
- The owners should be a list of ethereum addresses
- The threshold should be a number
- The chain should be a string

Recent conversation:
{{recentMessages}}`;
export const safeExecuteTemplate = `Look at your LAST RESPONSE in the conversation where you ask about sending a transaction from a Safe multisig wallet.   

For example:
- "Send 1000 USDC to 0x1234567890 on mainnet" -> { "to": "0x1234567890", "token": "USDC", "value": "1000", "chain": "mainnet" } 
- "Send 0.001 ETH on arbitrum one" -> { "to": "0x1234567890", "token": "", "value": "0.001", "chain": "arbitrum one" }
- "What is the balance of my Safe?" -> { "chain": "arbitrum one" }
- "What is the Safe address?" -> { "chain": "arbitrum one" }
- "What is the Safe deployment transaction?" -> { "chain": "arbitrum one" }
- "What is the Safe execution transaction?" -> { "chain": "arbitrum one" }


\`\`\`json
{
    "to": "<to>",
    "token": "<token>",
    "value": "<value>",
    "chain": "<chain>"
}
\`\`\`

Note:
- The to should be a ethereum address
- The token should be a ethereum token address
- The value should be a number
- The chain should be a string

Recent conversation:
{{recentMessages}}`;