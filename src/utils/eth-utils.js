import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3';

const ethUtils = {
  provider: null,
  web3: null,
  loadProvider: async (handleChainChanged, handleAccountsChanged) => {
    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider();

    if (!provider) {
      console.log('Please install MetaMask!');
      return;
    }

    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    } else {
      if (handleChainChanged) {
        provider.on('chainChanged', handleChainChanged);
      }

      if (handleAccountsChanged) {
        // Note that this event is emitted on page load.
        // If the array of accounts is non-empty, you're already
        // connected.
        provider.on('accountsChanged', handleAccountsChanged);
      }

      return provider;
    }
  },
  loadWeb3: (provider) => {
    return new Web3(provider);
  },
  loadContractDeployed: async (chainId) => {
    const artifactsURL = {
      31337: './localhost.network.json',
      1: './mainnet.network.json',
      3: './ropsten.network.json',
      4: './rinkeby.network.json',
      5: './goerli.network.json',
      42: './kovan.network.json',
      56: './bsc.network.json',
      97: './bscTest.network.json',
      137: './polygon.network.json',
      80001: './polygonMumbai.network.json',
    }[chainId];

    const contractDeployed = await (async (url) => {
      if (artifactsURL) {
        const res = await fetch(artifactsURL, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        return await res.json();
      }
    })(artifactsURL);

    return contractDeployed;
  },
  loadContract: (web3, contractDeployed, name) => {
    const contract = contractDeployed.contracts[name];
    if (contract) {
      return new web3.eth.Contract(contract.abi, contract.address);
    }
  },
  connectToMetaMask: (provider, handleAccountsChanged) => {
    provider
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  },
  etherscanLink: {
    31337: null,
    1: 'https://etherscan.io/address/',
    3: 'https://ropsten.etherscan.io/address/',
    4: 'https://rinkeby.etherscan.io/address/',
    5: 'https://goerli.etherscan.io/address/',
    42: 'https://kovan.etherscan.io/address/',
    56: 'https://bscscan.com/address/',
    97: 'https://testnet.bscscan.com/address/',
    137: 'https://polygonscan.com/address/',
    80001: 'https://mumbai.polygonscan.com/address/',
  },
  loadAddressVerified: async () => {
    const res = await fetch('./verified-address.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return await res.json();
  },
};

export default ethUtils;