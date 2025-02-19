export const halalScannerTemplate = `Look at your LAST RESPONSE in the conversation where you ask about a token and wheather it is halal or not.
Based on ONLY that last message, extract the token name:

For example:
- "Is PIP halal?" -> { "token": "PIP" }
- "Is HYPE halal?" -> { "token": "HYPE" }
- "Is ETH halal?" -> { "token": "ETH" }

\`\`\`json
{
    "token": "<token symbol from your last message>"
}
\`\`\`

Note:
- Just return the token name or symbol (PIP, HYPE, ETH, etc.)
- Remove any suffixes like "-SPOT" or "USDC"
- If multiple tokens are mentioned, use the last one

Recent conversation:
{{recentMessages}}`;
