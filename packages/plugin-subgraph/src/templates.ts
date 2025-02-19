export const subgraphQueryTemplate = `Look at your LAST RESPONSE in the conversation and create a graphql query with fields users requested in the conversation.

For example:
- "How many owners of this token are there?"
- "What is the total supply of this token?"
- "What is my balance of this token?"
- "Give me the token name and symbol"
- " How many transactions have been made on this token?"
- "How many users have this token?"
- " Top 10 users with the most tokens"
- "Retrieve the first 20 users record who bought this token"
- "Retrieve the first 20 users record who sold this token"
- "Retrieve the first 20 users record who bought and sold this token"
- " How many users have this token in a particular day" 

Example query:
\`\`\`graphql
{  
  accounts {  
    id  
    balances {  
      id  
      token {  
        id  
        name  
        symbol  
        decimals  
      }  
      amount  
    }  
  }  
}
\`\`\`
\`\`\`graphql
{
    users(first: 20){
      id
      address
      balance
      transactionCount
   }
}

\`\`\`

\`\`\`graphql
{
    users(first: 20){
      id
      address
      balance
      transactionCount
   }
}

\`\`\`
\`\`\`graphql
{
  userCounters(where:{id:"19455"}) {
    id
    count
  }
}

\`\`\`
\`\`\`graphql
{
    users(first: 20){
      id
      address
      balance
      transactionCount
   }
}

\`\`\`


Note:
- format the query as a valid graphql query
- review the query and make sure it is correct


Recent conversation:
{{recentMessages}}`;
