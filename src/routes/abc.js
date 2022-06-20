import React from 'react';
import {
  ContractMethodSend,
  ContractMethodCall,
  ContractMethodDynamicArrayCall,
  ContractMethodCallView,
  ContractMethodArrayCallView,
  ContractMethodDynamicArrayCallView,
  ETHBalanceView,
  SignSignature,
} from '../components/contract-caller-view';
import { ContractAddressSetter } from '../components/contracts';
import { renderAddress, renderAddressVerified } from '../components/etherscan-view';
import ethUtils from '../utils/eth-utils';

class ABC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
      devMode: false,
      contractErc721: null,
    }

    this.web3 = ethUtils.web3;
    this.chainId = ethUtils.chainId;
    this.accounts = ethUtils.accounts;
    this.contractDeployed = ethUtils.contractDeployed;
    this.contracts = {
      operatorHub: ethUtils.loadContract(this.web3, this.contractDeployed, 'OperatorHub'),
      signerHub: ethUtils.loadContract(this.web3, this.contractDeployed, 'SignerHub'),
      proxy: ethUtils.loadContract(this.web3, this.contractDeployed, 'MNProxyUserMintable'),
      erc721: ethUtils.loadContract(this.web3, this.contractDeployed, 'ERC721MN'),
    };
    this.addressVerified = ethUtils.addressVerified;
    this.etherscanLink_address = ethUtils.etherscanLink.address[this.chainId];
    this.etherscanLink_tx = ethUtils.etherscanLink.tx[this.chainId];
    this.contractProxy = this.contracts.proxy;
    this.state.contractErc721 = this.contracts.erc721;
  }

  renderTop() {
    const proxyView = (
      <div style={{ marginBottom: '16px' }}>
        <b>proxy: </b>{renderAddress(this.contractProxy._address, this.etherscanLink_address)}
      </div>
    );
    const erc721View = (
      <div>
        <b>erc721: </b>
        {
          this.state.contractErc721 ?
            renderAddress(this.state.contractErc721._address, this.etherscanLink_address) : null
        }
        <ContractAddressSetter
          web3={this.web3}
          abi={this.contracts.erc721._jsonInterface}
          callback={contract => {
            this.setState({ contractErc721: contract });
          }} />
      </div>
    );
    return (
      <div>
        <h2 style={{ margin: '8px 0' }}>ABC模式</h2>
        {proxyView}
        {erc721View}
      </div>
    );
  }

  /**
   * A Mode
   */
  renderSend_Mint() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contractProxy,
      desc: 'Mint給用戶',
      method: 'mint',
      args: [
        {
          type: 'string',
          title: '我方ERC721合約地址',
          value: this.state.contractErc721._address || '',
        },
        {
          type: 'string',
          title: '用戶地址',
          value: '',
        },
        {
          type: 'number',
          title: 'nft id',
          value: 0,
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  /**
   * B Mode
   */
  renderCall_Threshold() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contractProxy,
      title: 'Threshold',
      desc: '用戶自行Mint需要的簽名數量',
      method: 'threshold',
      args: [],
      renderText: (threshold) => {
        return (
          <div>至少需要：{threshold}</div>
        );
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderSend_UserMint() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contractProxy,
      desc: '用戶自行Mint',
      method: 'userMint',
      args: [
        {
          type: 'number',
          title: 'userMintId (後端系統編號)',
          value: 0,
        },
        {
          type: 'string',
          title: '我方ERC721合約地址',
          value: this.state.contractErc721._address || '', 
        },
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
        {
          type: 'string',
          title: '簽名',
          value: '',
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderUserMintSignSignature() {
    const props = {
      web3: this.web3,
      signer: this.accounts[0],
      desc: '產生用戶自行Mint的簽名',
      args: [
        {
          type: 'string',
          title: 'prefix',
          value: 'userMintERC721',
        },
        {
          type: 'number',
          title: 'userMintId',
          value: 0,
        },
        {
          type: 'string',
          title: '用戶地址',
          value: '',
        },
        {
          type: 'string',
          title: '我方ERC721合約地址',
          value: this.state.contractErc721._address || '',
        },
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <SignSignature {...props} />;
  }

  

  /**
   * C Mode
   */
  renderSend_Approve() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.state.contractErc721,
      desc: '授權某個NFT給Proxy',
      method: 'approve',
      args: [
        {
          type: 'string',
          title: '授權對象地址',
          value: this.contractProxy._address,
        },
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_Transfer() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contractProxy,
      desc: 'Transfer A的NFT給B（需要A授權）',
      method: 'transfer',
      args: [
        {
          type: 'string',
          title: '我方ERC721合約地址',
          value: this.state.contractErc721._address || '',
        },
        {
          type: 'string',
          title: 'A用戶地址',
          value: '',
        },
        {
          type: 'string',
          title: 'B用戶地址',
          value: '',
        },
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  ////////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div key={this.state.contractErc721?._address}>
        {this.renderTop()}
        <h2 style={{ borderTop: "solid 1px" }}>A模式-販售NFT</h2>
        {this.renderSend_Mint()}
        <h2 style={{ borderTop: "solid 1px" }}>B模式-販售數位商品</h2>
        {this.renderCall_Threshold()}
        {this.renderUserMintSignSignature()}
        {this.renderSend_UserMint()}
        <h2 style={{ borderTop: "solid 1px" }}>C模式-C2C交易</h2>
        {this.renderSend_Approve()}
        {this.renderSend_Transfer()}
      </div>
    );
  }
}

export default ABC;