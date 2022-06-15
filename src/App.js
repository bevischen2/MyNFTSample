import React from 'react';
import { Outlet, Link } from "react-router-dom";
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
    this.chainId = ethUtils.chainId = chainId;
    this.contractDeployed = ethUtils.contractDeployed = contractDeployed;
    this.addressVerified = ethUtils.addressVerified = await ethUtils.loadAddressVerified();
    this.addressVerified[this.contractDeployed.contracts.SignerHub.address] = 'Signer Hub';
    this.addressVerified[this.contractDeployed.contracts.OperatorHub.address] = 'Operator Hub';
    this.addressVerified[this.contractDeployed.contracts.MNProxyUserMintable.address] = 'Proxy';
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
      window.location.reload();
      this.accounts = ethUtils.accounts = [];
      this.setState({ account: null });
    } else if (accounts !== this.accounts) {
      window.location.reload();
      this.accounts = ethUtils.accounts = accounts;
      this.setState({ account: accounts[0] });
    }
  }

  connect() {
    // load accounts from metamask.
    ethUtils.connectToMetaMask(this.provider, accounts => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');

        this.accounts = ethUtils.accounts = [];
        this.setState({ account: null });
      } else if (accounts !== this.accounts) {
        this.accounts = ethUtils.accounts = accounts;
        this.setState({ account: accounts[0] });
      }
    });
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
      <div style={{ padding: "16px" }}>
        <div>Connected. {this.state.account}</div>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <Link to="/proxy">Proxy</Link> |{" "}
          <Link to="/erc721">ERC721</Link> |{" "}
          <Link to="/signer-hub">Signer Hub</Link> |{" "}
          <Link to="/operator-hub">Operator Hub</Link> |{" "}
        </nav>
        <Outlet context={[this.state.account]} />
      </div >
    );
  }
}

export default App;
