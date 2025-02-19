import { GOOGLE_CLIENT_ID } from "./core/constants";
import useEphemeralKeyPair from "./core/useEphemeralKeyPair";
import { useKeylessAccounts } from "./core/useKeylessAccounts";

export const createAptosWalletService = () => {
 

   const ConnectToGoogleService = async () => {
    const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
   
  redirectUrl.search = searchParams.toString();
  return redirectUrl;
  };
   const handleLoginCallback = async (idToken: string) => {
    try {
   const keylessAccount = await useKeylessAccounts((state) => state.switchKeylessAccount)(idToken);
      // Assuming there's a function to navigate within Eliza
      console.log("keylessAccount", keylessAccount);
      return keylessAccount;
    } catch (error) {
      // Assuming there's a function to navigate within Eliza
      console.log("error", error);
      return null;
    }
  };
   



  return {  ConnectToGoogleService, handleLoginCallback };
};



