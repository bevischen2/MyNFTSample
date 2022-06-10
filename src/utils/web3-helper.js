import React from 'react';

class ContractMethodSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      method: props.method,
      args: props.args,
      desc: props.desc,
      status: 'None',
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
    // console.log(event);
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
    let eGas = await contract.methods[method](...args).estimateGas({ from: account });

    this.setState({ status: 'Executing...' });
    contract.methods[method](...args)
      .send({ from: account, gas: Math.floor(eGas * 1.5) })
      .on('transactionHash', (hash) => {
        this.setState({
          status: [
            'Executing...',
            <br key='br' />,
            'Tx: ' + hash,
          ]
        });
      })
      .on('receipt', (receipt) => {
        this.setState({
          status: [
            'Completed.',
            <br key='br' />,
            'Tx: ' + receipt.transactionHash,
          ]
        });
      })
      .on('error', (error) => {
        if (typeof (this.state.status) === 'string') {
          this.setState({
            status: [
              'Error.',
              <br key='br' />,
              error.message,
            ]
          });
        } else {
          let status = this.state.status.slice();
          status[0] = 'Error.';
          this.setState({
            status: [
              ...status,
              <br key='br' />,
              error.message,
            ]
          });
        }
      })
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
        <h3>{this.state.desc}</h3>
        <p>Status: {this.state.status}</p>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputs()}
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

class ContractMethodCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      method: props.method,
      args: props.args,
      desc: props.desc,
      title: props.title,
      text: '',
      renderText: props.renderText,
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
    // console.log(event);
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
    contract.methods[method](...args)
      .call({ from: account }, (error, result) => {
        if (error) {
          this.setState({ text: `${error.message}` });
          return;
        }

        if (this.state.renderText) {
          const renderText = this.state.renderText(result);
          this.setState({ text: renderText });
        } else {
          this.setState({ text: `${this.state.method}： ${result}` });
        }
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
        <h3>{this.state.title}</h3>
        <div className='new-line'>{this.state.desc}</div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputs()}
          <input type="submit" value="查詢" />
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
          <input type="submit" value="查詢" />
        </form>
        <div>{this.state.text}</div>
      </div>
    );
  }
}

class ContractMethodCallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      method: props.method,
      args: props.args,
      title: props.title,
      desc: props.desc,
      text: 'Waiting...',
      renderText: props.renderText,
    };

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  callContractMethod() {
    const contract = this.state.contract;
    const method = this.state.method;
    const account = this.state.accounts[0];
    const args = this.state.args;

    this.setState({ text: 'Waiting...' });
    contract.methods[method](...args)
      .call({ from: account }, (error, result) => {
        if (error) {
          this.setState({ text: `${error.message}` });
          return;
        }

        if (this.state.renderText) {
          const renderText = this.state.renderText(result);
          this.setState({ text: renderText });
        } else {
          this.setState({ text: `${this.state.method}： ${result}` });
        }
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
        <h3>{this.state.title}</h3>
        <div className='new-line'>{this.state.desc}</div>
        <div>
          <button onClick={() => this.callContractMethod()}>
            Refresh
          </button>
          <div>{this.state.text}</div>
        </div>
      </div>
    );
  }
}

class ContractMethodArrayCallView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      method: props.method,
      indexes: props.indexes,
      title: props.title,
      desc: props.desc,
      text: 'Waiting...',
      renderText: props.renderText,
      results: props.indexes.map(() => null),
    };

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  callContractMethod() {
    const contract = this.state.contract;
    const method = this.state.method;
    const account = this.state.accounts[0];
    const indexes = this.state.indexes;

    this.setState({ text: 'Waiting...' });

    for (let i = 0; i < indexes.length; i++) {
      contract.methods[method](...indexes[i])
        .call({ from: account }, (error, result) => {
          const results = this.state.results;
          if (error) {
            results[i] = `${error.message}`;
            return;
          }
          if (this.state.renderText) {
            results[i] = <div>{`[${i}]: `}{this.state.renderText(result)}</div>;
          } else {
            results[i] = `[${i}]: ${result}`;
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
        <div>
          <button onClick={() => this.callContractMethod()}>
            Refresh
          </button>
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
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      sourceMethod: props.sourceMethod,
      method: props.method,
      args: props.args,
      title: props.title,
      desc: props.desc,
      text: 'Waiting...',
      renderText: props.renderText,
      results: null,
    };

    this.callContractMethod = this.callContractMethod.bind(this);
  }

  componentDidMount() {
    this.callContractMethod();
  }

  async callContractMethod() {
    const contract = this.state.contract;
    const method = this.state.method;
    const args = this.state.args;
    const account = this.state.accounts[0];

    this.setState({ text: 'Waiting...' });

    const indexes = await this.state.sourceMethod.call({ from: account })

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
            results[i] = <div>{`[${i}]: `}{this.state.renderText(result)}</div>;
          } else {
            results[i] = `[${i}]: ${result}`;
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
        <div>
          <button onClick={() => this.callContractMethod()}>
            Refresh
          </button>
          <div>{this.state.text}</div>
        </div>
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

export {
  ContractMethodSend,
  ContractMethodCall,
  ContractMethodDynamicArrayCall,
  ContractMethodCallView,
  ContractMethodArrayCallView,
  ContractMethodDynamicArrayCallView,
  ETHBalanceView
};