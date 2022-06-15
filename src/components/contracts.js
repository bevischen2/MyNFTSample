export function ContractAddressSetter(props) {
    const web3 = props.web3;
    const abi = props.abi;
    const callback = props.callback;

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const address = [...e.target].slice(0, e.target.length - 1).map(args => args.value)[0];
            callback(new web3.eth.Contract(abi, address));
        }}>
            <label>合約地址：</label>
            <input style={{ width: '330px' }} name={'contract-address'} type="text" />
            <input style={{ margin: '0 8px' }} type="submit" value="load" />
        </form>
    )
}