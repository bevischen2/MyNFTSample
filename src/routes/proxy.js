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
import { renderAddress, renderAddressVerified } from '../components/etherscan-view';
import ethUtils from '../utils/eth-utils';

class Proxy extends React.Component {
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
    this.contract = this.contracts.proxy;
  }

  renderTop() {
    return (
      <div>
        <h2 style={{ margin: '8px 0' }}>Proxy</h2>
        {renderAddress(this.contract._address, this.etherscanLink_address)}
      </div>
    );
  }

  /*
   * MNAccessControl, Ownable, Pausable
   */
  renderCall_Owner() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
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
      contract: this.contract,
      desc: '轉移Owner權限',
      method: 'transferOwnership',
      args: [
        {
          type: 'string',
          title: '新owner地址',
          value: '',
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderCall_Pausers() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Pausers',
      desc: '用於暫停/解除暫停proxy的nft交易',
      method: 'pausers',
      indexes: [0, 1, 2].map((i) => [i]),
      renderText: (data) => {
        return renderAddressVerified(this.addressVerified, data, this.etherscanLink_address);
      }
    };
    return <ContractMethodArrayCallView {...props} />;
  }

  renderSend_SetPauser() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '設定Pauser',
      method: 'setPauser',
      args: [
        {
          type: 'number',
          title: 'index',
          value: 0,
        },
        {
          type: 'string',
          title: '新pauser地址',
          value: '',
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderCall_Paused() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Paused',
      desc: '合約暫停狀態',
      method: 'paused',
      args: [],
      renderText: (isPaused) => {
        return (
          <div>Proxy NFT交易是否暫停中：{isPaused ? '是' : '否'}</div>
        );
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderSend_Pause() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '暫停',
      method: 'pause',
      args: [],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_Unpause() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '解除暫停',
      method: 'unpause',
      args: [],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  /**
   * MNProxy, MNProxyUserMintable
   */
  renderCall_OperatorHub() {
    let props = {
      web3: this.web3,
      accounts: this.accounts,
      contract: this.contract,
      title: 'Operator Hub',
      desc: '合約地址',
      method: 'operatorHub',
      args: [],
      renderText: (address) => {
        return <div>
          合約地址：{renderAddressVerified(this.addressVerified, address, this.etherscanLink)}
        </div>;
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderSend_UpdateOperatorHub() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '更新Operator Hub',
      method: 'updateOperatorHub',
      args: [
        {
          type: 'string',
          title: '新合約地址',
          value: '',
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_UpdateSignerHub() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '更新Signer Hub',
      method: 'updateSignerHub',
      args: [
        {
          type: 'string',
          title: '新合約地址',
          value: '',
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderCall_SignerHub() {
    let props = {
      web3: this.web3,
      accounts: this.accounts,
      contract: this.contract,
      title: 'Signer Hub',
      desc: '合約地址',
      method: 'signerHub',
      args: [],
      renderText: (address) => {
        return <div>
          合約地址：{renderAddressVerified(this.addressVerified, address, this.etherscanLink)}
        </div>;
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderSend_Mint() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: 'Mint給用戶',
      method: 'mint',
      args: [
        {
          type: 'string',
          title: '我方ERC721合約地址',
          value: '',
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

  renderSend_Transfer() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: 'Transfer A的NFT給B（需要A授權）',
      method: 'transfer',
      args: [
        {
          type: 'string',
          title: '我方ERC721合約地址',
          value: '',
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

  renderCall_Threshold() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
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

  renderSend_UpdateThreshold() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '更新Threshold',
      method: 'updateThreshold',
      args: [
        {
          type: 'number',
          title: '數量',
          value: 1,
        },
      ],
      etherscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_UserMint() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
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
          value: '',
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

  renderCall_UserMintHistories() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'userMintHistories',
      desc: '用戶自行Mint的記錄',
      method: 'userMintHistories',
      args: [
        {
          type: 'number',
          title: 'userMintId (後端系統編號)',
          value: 0,
        },
      ],
      renderText: (data) => {
        if (data.to === '0x0000000000000000000000000000000000000000') {
          return <div>此提領id尚未使用</div>;
        }

        return (
          <div>
            <div>合約地址：{data.token}</div>
            <div>用戶地址：{data.to}</div>
            <div>NFT id：{data.tokenId}</div>
          </div>
        );
      }
    };
    return <ContractMethodCall {...props} />;
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
    return <SignSignature {...props} />;
  }

  ////////////////////////////////////////////////////////////////////////////////
  renderDevModeView() {
    const content = () => {
      if (!this.state.devMode) { return; }
      return <div>
        {this.renderSend_TransferOwnership()}
        {this.renderSend_SetPauser()}
        {this.renderSend_Pause()}
        {this.renderSend_Unpause()}
        {this.renderSend_UpdateOperatorHub()}
        {this.renderSend_UpdateSignerHub()}
        {this.renderSend_UpdateThreshold()}
        {this.renderUserMintSignSignature()}
      </div>;
    }
    return (
      <div style={{ borderTop: '1px solid #ccc' }}>
        <div style={{ color: 'red' }}><label>
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

  render() {
    return (
      <div>
        {this.renderTop()}
        {this.renderCall_Owner()}
        {this.renderCall_Pausers()}
        {this.renderCall_Paused()}
        {this.renderCall_OperatorHub()}
        {this.renderCall_SignerHub()}
        {this.renderSend_Mint()}
        {this.renderSend_Transfer()}
        {this.renderCall_Threshold()}
        {this.renderSend_UserMint()}
        {this.renderCall_UserMintHistories()}
        {this.renderDevModeView()}
      </div>
    );
  }
}

export default Proxy;