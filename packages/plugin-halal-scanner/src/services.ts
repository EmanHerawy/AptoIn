import {
    HalalScannerResponse
} from "./types";

const fakeResponse = {
    IsHalal: true,
    justification: "This token is halal",
    riskAssessment: "This token is low risk"
}

        
export const createHalalScannerService = (tokenName: string, CREWAI_URL: string, HALAL_SCANNER_BEARER_TOKEN: string, agentTaskId?: string) => {
    const checkTokenForHalalCompliance = async (): Promise<HalalScannerResponse> => {
        if ( !CREWAI_URL ) {
            throw new Error("Invalid parameters");
        }
        
        console.log('tokenName: ', tokenName)
        console.log('agentTaskId: ', agentTaskId)
        if (!tokenName) {
            throw new Error("Token name is required");
        }
      
        try {
          if (!agentTaskId) {
           const query= {
                "inputs": {
                    "risk_tolerance": "medium",
                    "token_name": tokenName,
                    "trading_strategy_preference": "long"
                },
                "taskWebhookUrl":"",
                "stepWebhookUrl":"",
                "crewWebhookUrl":"",
                "trainingFilename":"",
                "generateArtifact":false
              }
         
            const url = `${CREWAI_URL}/kickoff`; // Updated to use environment variables
            // Fetch the URL and check if the response is OK
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${HALAL_SCANNER_BEARER_TOKEN}`
                },
                body: JSON.stringify(query)
            });
            console.log("response: ", response)
            if (!response.ok) {
                console.log("error in response: ", response)
               // If not OK, parse the error response and throw an error
               const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            // // If the response is OK, parse the data from the response
             const data = await response.json();
            return data;
          }
          else {
        
            const url = `${CREWAI_URL}/status/${agentTaskId}`; // Updated to use environment variables
            // Fetch the URL and check if the response is OK
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${HALAL_SCANNER_BEARER_TOKEN}`
                },
            });
            console.log("response: ", response)
            if (!response.ok) {
                console.log("error in response: ", response)
               // If not OK, parse the error response and throw an error
               const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }
            const data = await response.json();
            return data;
          }
        } catch (error: any) {
            console.error("Halal Scanner API Error:", error.message);
            throw error;
        }
    };



    return { checkTokenForHalalCompliance };
};


