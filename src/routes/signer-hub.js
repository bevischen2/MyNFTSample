import React from 'react';
import {
  ContractMethodSend,
  ContractMethodCall,
  ContractMethodDynamicArrayCall,
  ContractMethodCallView,
  ContractMethodArrayCallView,
  ContractMethodDynamicArrayCallView,
  ETHBalanceView,
} from '../components/contract-caller-view';
import { renderAddress, renderAddressVerified } from '../components/etherscan-view';
import ethUtils from '../utils/eth-utils';

class SignerHub extends React.Component {
  constructor(props) {
    super(props);
    this.state = { account: props.account }

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
  }

  renderTop() {
    return (
      <div>
        <h2 style={{ margin: '8px 0' }}>Signer Hub</h2>
        {renderAddress(this.contracts.signerHub._address, this.etherscanLink_address)}
      </div>
    );
  }

  renderCall_Owner() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      title: 'Owner',
      desc: '合約擁有者',
      method: 'owner',
      args: [],
      renderText: (data) => {
        return <div>
          擁有者地址： {renderAddressVerified(this.addressVerified, data, this.etherscanLink_address)}
        </div>;
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderSend_TransferOwnership() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      desc: '轉移Owner權限',
      method: 'transferOwnership',
      args: [
        {
          type: 'string',
          title: '新owner地址',
          value: '',
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderCall_AddressList() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      title: 'Signer列表',
      desc: '用於製作簽名讓前端用戶Mint',
      sourceMethod: this.contracts.signerHub.methods.getCount(),
      method: 'getAt',
      args: [],
      renderText: (address) => {
        return renderAddressVerified(this.addressVerified, address, this.etherscanLink_address);
      }
    };
    return <ContractMethodDynamicArrayCallView {...props} />;
  }

  renderSend_Set() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      desc: '新增Signer',
      method: 'set',
      args: [
        {
          type: 'string',
          title: '新Signer地址',
          value: '',
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_DeleteAt() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      desc: '刪除Signer',
      method: 'deleteAt',
      args: [
        {
          type: 'number',
          title: '目前signer索引編號（執行完畢需Refresh列表）',
          value: 0,
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  render() {
    return (
      <div>
        {this.renderTop()}
        {this.renderCall_Owner()}
        {this.renderCall_AddressList()}
        {this.renderSend_Set()}
        {this.renderSend_DeleteAt()}
        {this.renderSend_TransferOwnership()}
      </div>
    );
  }
}

export { SignerHub };