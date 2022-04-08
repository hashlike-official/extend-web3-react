import { useState } from 'react';
import { useTransfer, useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';

export default function Transfer() {
  const account = useWeb3Store((state) => state.account);
  const transfer = useTransfer();

  const [sendAddress, setSendAddress] = useState('');
  const [sendKlay, setSendKlay] = useState(0);

  const sendButtonHandler = () => {
    if (account) {
      transfer(account, sendAddress, sendKlay);
    }
  };

  return (
    <section style={{ marginTop: '3rem' }}>
      <input
        placeholder="주소"
        onChange={(e) => {
          setSendAddress(e.target.value);
        }}
      ></input>
      <input
        type="number"
        placeholder="KLAY"
        onChange={(e) => setSendKlay(Number(e.target.value))}
      ></input>
      <button onClick={sendButtonHandler}>전송</button>
    </section>
  );
}
