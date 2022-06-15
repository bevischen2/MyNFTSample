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

class MNERC721 extends React.Component {
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
    this.contract = this.contracts.erc721;
  }

  renderTop() {
    return (
      <div>
        <h2 style={{ margin: '8px 0' }}>ERC721</h2>
        {renderAddress(this.contract._address, this.etherscanLink_address)}
      </div>
    );
  }

  /**
   * Ownable
   */
  renderCall_Owner() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Owner',
      desc: '合約擁有者',
      method: 'owner',
      args: [],
      renderText: (data) => {
        return (
          <div>
            擁有者地址： {renderAddressVerified(this.addressVerified, data, this.etherscanLink_address)}
          </div>
        );
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
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  /**
   * ERC721MN
   */
  renderCall_Proxy() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Proxy',
      desc: '合約地址',
      method: 'proxy',
      args: [],
      renderText: (data) => {
        return (
          <div>
            合約地址： {renderAddressVerified(this.addressVerified, data, this.etherscanLink_address)}
          </div>
        );
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderCall_BaseURI() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Base URI',
      desc: '基礎網址',
      method: 'baseURI',
      args: [],
      renderText: (data) => {
        return <div>{data}</div>;
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderSend_UpdateProxy() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '更新Proxy',
      method: 'updateProxy',
      args: [
        {
          type: 'string',
          title: '新合約地址',
          value: '',
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_SetBaseURI() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '設定Base URI',
      method: 'setBaseURI',
      args: [
        {
          type: 'string',
          title: '新Base URI',
          value: '',
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  /**
   * ERC721
   */
  renderCall_Name() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Name',
      desc: 'ERC721 Meatadata',
      method: 'name',
      args: [],
      renderText: (data) => {
        return (
          <div>Name: {data}</div>
        );
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderCall_Symbol() {
    let props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Symbol',
      desc: 'ERC721 Meatadata',
      method: 'symbol',
      args: [],
      renderText: (data) => {
        return (
          <div>Symbol: {data}</div>
        );
      }
    };
    return <ContractMethodCallView {...props} />;
  }

  renderCall_TokenURI() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Token URI',
      desc: '完整的NFT網址',
      method: 'tokenURI',
      args: [
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      renderText: (data) => {
        return (
          <div>
            <a href={data} target="_blank" rel="noreferrer">{data}</a>
          </div>
        );
      }
    };
    return <ContractMethodCall {...props} />;
  }

  renderCall_BalanceOf() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'BalanceOf',
      desc: '用戶擁有的NFT數量',
      method: 'balanceOf',
      args: [
        {
          type: 'string',
          title: '用戶地址',
          value: '',
        },
      ],
      renderText: (data) => {
        return (
          <div>數量： {data}</div>
        );
      }
    };
    return <ContractMethodCall {...props} />;
  }

  renderCall_OwnerOf() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'OwnerOf',
      desc: '某個NFT的擁有者地址',
      method: 'ownerOf',
      args: [
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      renderText: (address) => {
        return (
          <div>
            用戶地址：{renderAddress(address, this.etherscanLink_address)}
          </div>
        );
      }
    };
    return <ContractMethodCall {...props} />;
  }

  renderCall_GetApproved() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Get Appreved',
      desc: '某個NFT的授權對象地址',
      method: 'getApproved',
      args: [
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      renderText: (address) => {
        return (
          <div>
            用戶地址：{renderAddressVerified(this.addressVerified, address, this.etherscanLink_address)}
          </div>
        );
      }
    };
    return <ContractMethodCall {...props} />;
  }

  renderSend_Approve() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: '授權某個NFT給別人',
      method: 'approve',
      args: [
        {
          type: 'string',
          title: '授權對象地址',
          value: '',
        },
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderCall_IsApprovedForAll() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      title: 'Is Approved For All',
      desc: '檢查B用戶是否為A用戶的NFT全權授權對象',
      method: 'isApprovedForAll',
      args: [
        {
          type: 'string',
          title: '擁有者地址（A用戶）',
          value: '',
        },
        {
          type: 'string',
          title: '可能的授權對象地址（B用戶）',
          value: '',
        },
      ],
      renderText: (isApprovedForAll) => {
        return (
          <div>
            驗證結果：{isApprovedForAll ? '是' : '否'}
          </div>
        );
      }
    };
    return <ContractMethodCall {...props} />;
  }

  renderSend_SetApprovalForAll() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: 'A用戶全權授權給B用戶操作NFT',
      method: 'setApprovalForAll',
      args: [
        {
          type: 'string',
          title: '授權對象地址',
          value: '',
        },
        {
          type: 'checkbox',
          title: '是/否',
          value: '',
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  renderSend_TransferFrom() {
    const props = {
      web3: this.web3,
      account: this.accounts[0],
      contract: this.contract,
      desc: 'transfer NFT給別人',
      method: 'transferFrom',
      args: [
        {
          type: 'string',
          title: '擁有者地址',
          value: '',
        },
        {
          type: 'string',
          title: '收取者地址',
          value: '',
        },
        {
          type: 'number',
          title: 'NFT id',
          value: 0,
        },
      ],
      therscanLink: this.etherscanLink_tx,
    };
    return <ContractMethodSend {...props} />;
  }

  ////////////////////////////////////////////////////////////////////////////////

  renderDevModeView() {
    const content = () => {
      if (!this.state.devMode) { return; }
      return <div>
        {this.renderSend_TransferOwnership()}
        {this.renderSend_UpdateProxy()}
        {this.renderSend_SetBaseURI()}
        {this.renderCall_TokenURI()}
        {this.renderSend_SetApprovalForAll()}
        {this.renderCall_IsApprovedForAll()}
        {this.renderSend_TransferFrom()}
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

  render() {
    return (
      <div>
        {this.renderTop()}
        {this.renderCall_Owner()}
        {this.renderCall_Proxy()}
        {this.renderCall_BaseURI()}
        {this.renderCall_Name()}
        {this.renderCall_Symbol()}
        {this.renderCall_BalanceOf()}
        {this.renderCall_OwnerOf()}
        {this.renderSend_Approve()}
        {this.renderCall_GetApproved()}
        {this.renderDevModeView()}
      </div>
    );
  }
}

export default MNERC721;