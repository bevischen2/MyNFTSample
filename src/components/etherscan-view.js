
export function renderAddress(address, etherscanLink) {
  return (
    <span>
      {address}<b> | </b>
      <a href={etherscanLink + address} target="_blank" rel="noreferrer">View on Etherscan</a>
    </span>
  );
}

export function renderAddressVerified(addressVerified, address, etherscanLink) {
  if (address === '0x0000000000000000000000000000000000000000') {
    return <span>尚未設定</span>;
  } else if (address in addressVerified) {
    return (
      <span>
        {address} <b>[{addressVerified[address]}] | </b>
        <a href={etherscanLink + address} target="_blank" rel="noreferrer">View on Etherscan</a>
      </span>
    );
  } else {
    return (
      <span>
        {address} <b>[未知] | </b>
        <a href={etherscanLink + address} target="_blank" rel="noreferrer">View on Etherscan</a>
      </span>
    );
  }
}

export function renderTx(tx, etherscanLink) {
  return (
    <span>
      <a href={etherscanLink + tx} target="_blank" rel="noreferrer">{tx}</a>
    </span>
  );
}