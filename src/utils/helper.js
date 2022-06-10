
export function renderAddress(address, etherscanLink) {
  return <span>
    {address}<br />
    <a href={etherscanLink + address} target="_blank">View on Etherscan</a>
  </span>;
}

export function renderVerifiedAddress(verifiedAddress, address, etherscanLink) {
  if (address === '0x0000000000000000000000000000000000000000') {
    return '尚未設定';
  } else if (address in verifiedAddress) {
    return <span>
      {address} [{verifiedAddress[address]}]<br />
      <a href={etherscanLink + address} target="_blank">View on Etherscan</a>
    </span>;
  } else {
    return <span>
      {address} <b>[未知]</b><br />
      <a href={etherscanLink + address} target="_blank">View on Etherscan</a>
    </span>;
  }
}

export function verifyAddress(verifiedAddress, address, etherscanLink) {
  if (address === '0x0000000000000000000000000000000000000000') {
    return '尚未設定';
  } else if (address in verifiedAddress) {
    return <span>
      <a href={etherscanLink + address} target="_blank">View on Etherscan</a>
      <br />{address} [{verifiedAddress[address]}]
    </span>;
  } else {
    return <span>
      <a href={etherscanLink + address} target="_blank">View on Etherscan</a>
      <br />{address} [未知]
    </span>;
  }
}