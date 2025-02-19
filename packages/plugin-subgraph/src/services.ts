import pkg  from '@apollo/client';
const { ApolloClient, InMemoryCache, gql } = pkg;

export const createTheGraphService = (tokensQuery: string, apiKey: string) => {
    const queryTheGraph = async (): Promise< any> => {
        if (!apiKey || !tokensQuery ) {
            throw new Error("Invalid parameters");
        }
       
      console.log(`hit service with query ${tokensQuery}`);
      
        try {

            const client = new ApolloClient({
                uri: apiKey,
                cache: new InMemoryCache(),
              })
              const data = await client
              .query({
                query: gql(tokensQuery),
              })
              .then((data) => {
                console.log('Subgraph data: ', data.data)
                return data.data;
              })
              .catch((err) => {
                console.log('Error fetching data: ', err)
              })
              return data;
        } catch (error: any) {
            console.error("The Graph API Error:", error.message);
            throw error;
        }
    };



    return { queryTheGraph };
};


