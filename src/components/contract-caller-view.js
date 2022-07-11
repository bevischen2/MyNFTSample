import React from 'react';
import { renderTx } from './etherscan-view';

class ContractMethodSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: props.args,
      status: null,
    };

    this.web3 = props.web3;
    this.account = props.account;
    this.contract = props.contract;
    this.method = props.method;
    this.desc = props.desc;
    this.etherscanLink = props.etherscanLink;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderInputs() {
    const inputs = [];
    for (let i = 0; i < this.state.args.length; i++) {
      inputs.push(
        <div key={i}>
          <label>
            <b>{this.state.args[i].title} : </b>
            <input style={{ width: '330px' }}
              name={i}
              type={this.state.args[i].type}
              value={this.state.args[i].value}
              onChange={this.handleChange} />
          </label>
        </div>
      );
    }
    return inputs;
  }

  handleChange(event) {
    const args = Object.assign([], this.state.args);
    args[event.target.name].value = event.target.value;
    this.setState({ args: args });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const errorHandler = error => {
      if (typeof (this.state.status) === 'string' || this.state.status === null) {
        this.setState({
          status: (
            <div>
              <div>Error.</div>
              <div>{error.message}</div>
            </div>
          )
        });
      } else {
        this.setState({
          status: (
            <div>
              {this.state.status}
              <div>Error.</div>
              <div>{error.message}</div>
            </div>
          )
        });
      }
    };

    try {
      const contract = this.contract;
      const method = this.method;
      const account = this.account;
      const args = [...event.target].slice(0, event.target.length - 1).map((e) => (e.value));
      const eGas = await contract.methods[method](...args).estimateGas({ from: account });

      this.setState({ status: 'Executing...' });
      contract.methods[method](...args)
        .send({ from: account, gas: Math.floor(eGas * 1.5) })
        .on('transactionHash', (tx) => {
          this.setState({
            status: (
              <div>
                <div>Executing...</div>
                <div>Tx: {renderTx(tx, this.etherscanLink)}</div>
              </div>
            )
          });
        })
        .on('receipt', (receipt) => {
          this.setState({
            status: (
              <div>
                <div>Completed.</div>
                <div>Tx: {renderTx(receipt.transactionHash, this.etherscanLink)}</div>
              </div>
            )
          });
        })
        .on('error', errorHandler);
    } catch (error) {
      errorHandler(error);
    }
  }

  render() {
    return (
      <div>
        <h3 style={{ marginBottom: '8px' }}>{this.desc}</h3>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInputs()}
            <input style={{ margin: '4px 0' }} type="submit" value="submit" />
          </form>
          <div>{this.state.status}</div>
        </div>
      </div>
    );
  }
}

class ContractMethodCallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.web3 = props.web3;
    this.account = props.account;
    this.contract = props.contract;
    this.method = props.method;
    this.args = props.args;
    this.title = props.title;
    this.desc = props.desc;
    this.renderText = props.renderText;

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  callContractMethod() {
    const contract = this.contract;
    const method = this.method;
    const account = this.account;
    const args = this.args;

    this.setState({ text: 'Waiting...' });
    contract.methods[method](...args)
      .call({ from: account }, (error, result) => {
        if (error) {
          this.setState({ text: `${error.message}` });
          return;
        }

        if (this.renderText) {
          const renderText = this.renderText(result);
          this.setState({ text: renderText });
        } else {
          this.setState({ text: `${this.method}： ${result}` });
        }
      });
  }

  render() {
    return (
      <div>
        <h3 style={{ marginBottom: '8px' }}>
          <span>{this.title} ({this.desc}) | </span>
          <button onClick={() => this.callContractMethod()}>Refresh</button>
        </h3>
        <div>
          <div>{this.state.text}</div>
        </div>
      </div>
    );
  }
}

class ContractMethodCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: props.args,
      text: '',
    };

    this.web3 = props.web3;
    this.account = props.account;
    this.contract = props.contract;
    this.method = props.method;
    this.desc = props.desc;
    this.title = props.title;
    this.renderText = props.renderText;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let args = Object.assign([], this.state.args);
    args[event.target.name].value = event.target.value;
    this.setState({ args: args });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const contract = this.contract;
    const method = this.method;
    const account = this.account;
    const args = [...event.target].slice(0, event.target.length - 1).map((e) => (e.value));

    this.setState({ text: 'Waiting...' });
    contract.methods[method](...args)
      .call({ from: account }, (error, result) => {
        if (error) {
          this.setState({ text: `${error.message}` });
          return;
        }

        if (this.renderText) {
          const renderText = this.renderText(result);
          this.setState({ text: renderText });
        } else {
          this.setState({ text: `${this.method}： ${result}` });
        }
      });
  }

  renderInputs() {
    const inputs = [];
    for (let i = 0; i < this.state.args.length; i++) {
      inputs.push(
        <div key={i}>
          <label>
            <b>{this.state.args[i].title} : </b>
            <input style={{ width: '330px' }}
              name={i}
              type={this.state.args[i].type}
              value={this.state.args[i].value}
              onChange={this.handleChange} />
          </label>
        </div>
      );
    }
    return inputs;
  }

  render() {
    return (
      <div>
        <h3 style={{ marginBottom: '8px' }}>
          <span>{this.title} ({this.desc})</span>
        </h3>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputs()}
          <input style={{ margin: '4px 0' }} type="submit" value="submit" />
        </form>
        <div>{this.state.text}</div>
      </div>
    );
  }
}

class ContractMethodDynamicArrayCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      sourceMethod: props.sourceMethod,
      method: props.method,
      args: props.args,
      title: props.title,
      desc: props.desc,
      text: '',
      renderText: props.renderText,
      results: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderInputs() {
    const inputs = [];
    for (let i = 0; i < this.state.args.length; i++) {
      inputs.push(
        <div key={i}>
          <label>
            {this.state.args[i].title}
            <br />
            <input
              name={i}
              type={this.state.args[i].type}
              value={this.state.args[i].value}
              onChange={this.handleChange} />
          </label>
        </div>
      );
    }
    return inputs;
  }

  handleChange(event) {
    let args = Object.assign([], this.state.args);
    args[event.target.name].value = event.target.value;
    this.setState({ args: args });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const contract = this.state.contract;
    const method = this.state.method;
    const account = this.state.accounts[0];
    let args = [...event.target]
      .slice(0, event.target.length - 1)
      .map((e) => (e.value));

    this.setState({ text: 'Waiting...' });

    const indexes = await this.state.sourceMethod(...args)
      .call({ from: account })

    if (indexes === '0') {
      this.setState({ text: '查無資料' });
      return;
    }

    this.state.results = Array.apply(null, Array(parseInt(indexes)));

    for (let i = 0; i < indexes; i++) {
      contract.methods[method](...args, i)
        .call({ from: account }, (error, result) => {
          const results = this.state.results;
          if (error) {
            results[i] = `${error.message}`;
            return;
          }
          if (this.state.renderText) {
            results[i] = `${i}: ${this.state.renderText(result)}`;
          } else {
            results[i] = `${i}: ${result}`;
          }
          this.setState({ text: this.renderResults() });
        });
    }
  }

  renderResults() {
    const results = this.state.results;
    return results.map((text, i) => (
      <div key={i}>
        {text}
      </div>
    ));
  }

  render() {
    if (this.state.web3 === null) {
      return (
        <div>
          <h3>Loading Web3, accounts, and contract...</h3>
        </div>
      );
    }
    return (
      <div>
        <h3>{this.state.title}</h3>
        <div className='new-line'>{this.state.desc}</div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputs()}
          <input type="submit" value="submit" />
        </form>
        <div>{this.state.text}</div>
      </div>
    );
  }
}

class ContractMethodArrayCallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };

    this.web3 = props.web3;
    this.account = props.account;
    this.contract = props.contract;
    this.method = props.method;
    this.indexes = props.indexes;
    this.title = props.title;
    this.desc = props.desc;
    this.renderText = props.renderText;
    this.results = props.indexes.map(() => null);

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  callContractMethod() {
    const contract = this.contract;
    const method = this.method;
    const account = this.account;
    const indexes = this.indexes;

    this.setState({ text: 'Waiting...' });

    for (let i = 0; i < indexes.length; i++) {
      contract.methods[method](...indexes[i])
        .call({ from: account }, (error, result) => {
          const results = this.results;
          if (error) {
            results[i] = `${error.message}`;
            return;
          }

          if (this.renderText) {
            results[i] = <div>{`[${i}]: `}{this.renderText(result)}</div>;
          } else {
            results[i] = `[${i}]: ${result}`;
          }
          this.setState({ text: this.renderResults() });
        });
    }
  }

  renderResults() {
    return this.results.map((text, i) => (<div key={i}>{text}</div>));
  }

  render() {
    return (
      <div>
        <h3 style={{ marginBottom: '8px' }}>
          <span>{this.title} ({this.desc}) | </span>
          <button onClick={() => this.callContractMethod()}>Refresh</button>
        </h3>
        <div>
          <div>{this.state.text}</div>
        </div>
      </div>
    );
  }
}

class ContractMethodDynamicArrayCallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.web3 = props.web3;
    this.account = props.account;
    this.contract = props.contract;
    this.sourceMethod = props.sourceMethod;
    this.method = props.method;
    this.args = props.args;
    this.title = props.title;
    this.desc = props.desc;
    this.renderText = props.renderText;
    this.results = null;

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  async callContractMethod() {
    const contract = this.contract;
    const method = this.method;
    const args = this.args;
    const account = this.account;

    this.setState({ text: 'Waiting...' });
    const indexes = await this.sourceMethod.call({ from: account });

    if (indexes === '0') {
      this.setState({ text: '查無資料' });
    } else {
      this.results = Array.apply(null, Array(parseInt(indexes)));
      for (let i = 0; i < indexes; i++) {
        contract.methods[method](...args, i)
          .call({ from: account }, (error, result) => {
            if (error) {
              this.results[i] = `${error.message}`;
              return;
            }

            if (this.renderText) {
              this.results[i] = <div>{`[${i}]: `}{this.renderText(result)}</div>;
            } else {
              this.results[i] = `[${i}]: ${result}`;
            }
            this.setState({ text: this.renderResults() });
          });
      }
    }
  }

  renderResults() {
    return this.results.map((text, i) => (
      <div key={i}>{text}</div>
    ));
  }

  render() {
    return (
      <div>
        <h3 style={{ marginBottom: '8px' }}>
          <span>{this.title} ({this.desc}) | </span>
          <button onClick={() => this.callContractMethod()}>Refresh</button>
        </h3>
        <div>{this.state.text}</div>
      </div>
    );
  }
}

class ETHBalanceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      account: props.account,
      text: 'Waiting...',
    };

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  callContractMethod() {
    const account = this.state.account;
    const web3 = this.state.web3;

    this.setState({ text: 'Waiting...' });
    web3.eth.getBalance(account, (error, result) => {
      if (error) {
        this.setState({ text: `${error.message}` });
        return;
      }

      this.setState({ text: `合約ETH餘額為： ${web3.utils.fromWei(result)} ethers` });
    });
  }

  render() {
    if (this.state.web3 === null) {
      return (
        <div>
          <h3>Loading Web3, accounts, and contract...</h3>
        </div>
      );
    }
    return (
      <div>
        <div>{this.state.text}</div>
        <button onClick={() => this.callContractMethod()}>
          Refresh
        </button>
      </div>
    );
  }
}

class SignSignature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: props.args,
      text: '',
    };

    this.web3 = props.web3;
    this.signer = props.signer;
    this.desc = props.desc;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderInputs() {
    const inputs = [];
    for (let i = 0; i < this.state.args.length; i++) {
      inputs.push(
        <div key={i}>
          <label>
            <b>{this.state.args[i].title} : </b>
            <input style={{ width: '330px' }}
              name={i}
              type={this.state.args[i].type}
              value={this.state.args[i].value}
              onChange={this.handleChange} />
          </label>
        </div>
      );
    }
    return inputs;
  }

  handleChange(event) {
    const args = Object.assign([], this.state.args);
    args[event.target.name].value = event.target.value;
    this.setState({ args: args });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const errorHandler = error => {
      if (typeof (this.state.text) === 'string' || this.state.text === null) {
        this.setState({
          text: (
            <div>
              <div>Error.</div>
              <div>{error.message}</div>
            </div>
          )
        });
      } else {
        this.setState({
          text: (
            <div>
              {this.state.text}
              <div>Error.</div>
              <div>{error.message}</div>
            </div>
          )
        });
      }
    };

    const signer = this.signer;
    const args = [...event.target].slice(0, event.target.length - 1).map((e) => (e.value));
    const soliditySha3 = this.web3.utils.soliditySha3(
      { type: 'string', value: args[0] },
      { type: 'uint256', value: args[1] },
      { type: 'address', value: args[2] },
      { type: 'address', value: args[3] },
      { type: 'uint256', value: args[4] },
      { type: 'uint32', value: args[5] }
    );

    this.setState({ status: 'Executing...' });
    this.web3.eth.personal.sign(soliditySha3, signer)
      .then(signature => {
        this.setState({
          text: (
            <div>{signature}</div>
          )
        });
      })
      .catch(errorHandler);
  }

  render() {
    return (
      <div>
        <h3 style={{ marginBottom: '8px' }}>{this.desc}</h3>
        <div>
          <form onSubmit={this.handleSubmit}>
            {this.renderInputs()}
            <input style={{ margin: '4px 0' }} type="submit" value="submit" />
          </form>
          <div>{this.state.text}</div>
        </div>
      </div>
    );
  }
}

export {
  ContractMethodSend,
  ContractMethodCall,
  ContractMethodDynamicArrayCall,
  ContractMethodCallView,
  ContractMethodArrayCallView,
  ContractMethodDynamicArrayCallView,
  ETHBalanceView,
  SignSignature,
};