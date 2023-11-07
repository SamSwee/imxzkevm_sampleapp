import { config, passport } from "@imtbl/sdk";
import { ethers } from "ethers";

const passportConfig = {
  clientId: import.meta.env.VITE_IMMUTABLE_CLIENT_ID ?? "YOUR_CLIENT_ID",
  redirectUri: `${import.meta.env.VITE_BASE_URL ?? "http://localhost:5003"}/callback`,
  logoutRedirectUri: import.meta.env.VITE_BASE_URL ?? "http://localhost:5003",
  scope: "transact openid offline_access email",
  audience: "platform_api",
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX, 
    apiKey: "", 
  })
};
const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

const fetchAuth = async () => {
  try {
    const accounts = await passportProvider.request({
      method: "eth_requestAccounts",
    });
    console.log("connected", accounts);
  } catch (error) {
    console.error(error);
  } finally {
    window.location.reload();
  }
};

async function getWalletInfo() {
  try {
    // Request the wallet address from the connected account
    const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    // Create an instance of ethers.js to interact with the Ethereum blockchain
    const provider = new ethers.providers.Web3Provider(passportProvider);

    // Request the token balance
    const balance = await passportProvider.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest']
    });
    const balanceInEther = ethers.utils.formatEther(balance);

    return {
      walletAddress,
      balanceInEther,
    };
  } catch (error) {
    console.error("Error getting wallet info:", error);
    return {
      walletAddress: null,
      balanceInEther: null,
    };
  }
}

async function initiateTransaction() {
  try {
    const accounts = await passportProvider.request({
      method: "eth_requestAccounts",
    });

    const params = {
      to: accounts[0],
      data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(''))
    };

    const txnHash = await passportProvider.request({
      method: "eth_sendTransaction",
      params: [params],
    });
    console.log(txnHash);

    return {
      txnHash,
      error: null,
    };
  } catch (error) {
    console.log("err", error.message);
    return {
      txnHash: null,
      error: error.message,
    };
  }
}

export { passportInstance, passportProvider, fetchAuth, initiateTransaction, getWalletInfo };
