import { createContext, useContext, useState } from "react";
import Web3 from "web3";



const DataContext = createContext({
  account: "",
  loading: true,
  loadWeb3: async () => {},
  futureFlowsMarket: null,
  futureFlowsToken: null,
});

export const DataProvider = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [futureFlowsMarket, setFutureFlowsMarket] = useState();
  const [futureFlowsToken, setFutureFlowsToken] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
      return;
    }
    var allAccounts = await window.web3.eth.getAccounts();
    setAccount(allAccounts[0]);
    await loadBlockchainData();
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;


    if (futureFlowMarketData && futureFlowTokenData) {
      var tempContract = await new web3.eth.Contract(
      );
      setFutureFlowsMarket(tempContract);
      var tempTokenContract = await new web3.eth.Contract(
      );

      setFutureFlowsToken(tempTokenContract);
    } else {
      window.alert("TestNet not found");
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    account,
    futureFlowsMarket,
    futureFlowsToken,
    loading,
    loadWeb3,
  };
};
