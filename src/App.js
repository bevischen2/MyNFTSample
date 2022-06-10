import React from 'react';
import ethUtils from './utils/eth-utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
    };
    this.provider = null;
    this.web3 = null;
    this.chainId = null;
    this.contractDeployed = null;
    this.contracts = {
      operatorHub: null,
      signerHub: null,
      proxy: null,
      erc721: null,
    }
    this.verifiedAddress = {};
    this.etherscanLink = null;

    // binding actions
    this.handleChainChanged = this.handleChainChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
  }

  async componentDidMount() {
    // load provider from metamask and set listeners.
    const provider = await ethUtils.loadProvider(this.handleChainChanged, this.handleAccountsChanged);

    // load web3 from provider.
    const web3 = ethUtils.loadWeb3(provider);

    // load the chian id.
    const chainId = await web3.eth.getChainId();

    // load the contract deployed to the chain id.
    const contractDeployed = await ethUtils.loadContractDeployed(chainId);
   
    this.provider = ethUtils.provider = provider;
    this.web3 = ethUtils.web3 = web3;
    this.chainId = chainId;
    this.contractDeployed = contractDeployed;
    this.contracts = {
      operatorHub: ethUtils.loadContract(web3, contractDeployed, 'MNAddressHub'),
      signerHub: ethUtils.loadContract(web3, contractDeployed, 'MNAddressHub'),
      proxy:ethUtils.loadContract(web3, contractDeployed, 'MNProxyUserMintable'),
      erc721: ethUtils.loadContract(web3, contractDeployed, 'ERC721MN'), 
    };
    this.etherscanLink = ethUtils.etherscanLink[chainId];
    this.addressVerified = await ethUtils.loadAddressVerified();
  }

  handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();

    console.log('handleChainChanged: ' + _chainId);
    console.log(this.state.web3.utils.hexToNumber(_chainId));
  }

  // For now, 'eth_accounts' will continue to always return an array
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');

      this.accounts = accounts;
      this.setState({ account: null });
    } else if (accounts !== this.accounts) {
      this.setState({ account: accounts[0] });
    }
  }

  connect() {
    // load accounts from metamask.
    ethUtils.connectToMetaMask(this.provider, this.handleAccountsChanged);
  }

  render() {
    if (!this.provider || this.state.account === null) {
      return (
        <div>
          v1.0.0
          <br />
          <button onClick={async () => { this.connect() }} >Connect</button>
        </div>
      );
    }

    return (
      <div>
        <div>Connected. {this.state.account}</div>
        {/* <Tabs tabs={this.renderTabs()} /> */}
      </div>
    );
  }
}

export default App;
