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
    this.state = {
      account: props.account,
      devMode: false,
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

  renderCall_GetAddresses() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      title: 'Signer列表',
      desc: '用於製作簽名讓前端用戶Mint',
      method: 'getAddresses',
      args: [],
      renderText: (addresses) => {
        const results = [];
        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i];
          results.push(
            <div key={i}>
              {`[${i}]: `}
              {renderAddressVerified(this.addressVerified, address, this.etherscanLink_address)}
            </div>
          )
        }
        return results;
      }
    };
    return <ContractMethodCallView {...props} />;
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

  renderDevModeView() {
    const content = () => {
      if (!this.state.devMode) { return; }
      return <div>
        {this.renderCall_Contains()}
        {this.renderCall_GetCount()}
        {this.renderCall_GetAt()}
      </div>;
    }
    return (
      <div style={{ borderTop: '1px solid #ccc' }}>
        <div><label>
          Dev Mode
          <input
            type="checkbox"
            checked={this.state.devMode}
            onChange={() => {
              this.setState({ devMode: !this.state.devMode });
            }}
          />
        </label></div>
        {content()}
      </div>
    );
  }

  renderCall_Contains() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      title: 'contains',
      desc: '檢查該Signer是否存在',
      method: 'contains',
      args: [
        {
          type: 'string',
          title: 'Signer地址',
          value: '',
        },
      ],
      renderText: (isExists) => {
        return isExists ? '存在' : '不存在';
      }
    };
    return <ContractMethodCall {...props} />;
  }

  renderCall_GetCount() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      title: 'getCount',
      desc: 'Signer數量',
      method: 'getCount',
      args: [],
      renderText: (data) => {
        return (
          <div>數量：{data}</div>
        );
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderCall_GetAt() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contracts.signerHub,
      title: 'getAt',
      desc: '利用index查詢Signer',
      method: 'getAt',
      args: [
        {
          type: 'number',
          title: 'index',
          value: '',
        },
      ],
      renderText: (address) => {
        return <div>地址：{address}</div>;
      }
    };
    return <ContractMethodCall {...props} />;
  }

  render() {
    return (
      <div>
        {this.renderTop()}
        {this.renderCall_Owner()}
        {this.renderCall_GetAddresses()}
        {this.renderSend_Set()}
        {this.renderSend_DeleteAt()}
        {this.renderSend_TransferOwnership()}
        {this.renderDevModeView()}
      </div>
    );
  }
}

export { SignerHub };