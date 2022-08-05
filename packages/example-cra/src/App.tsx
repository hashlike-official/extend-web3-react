import { useInitWallet, useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';
import { useEffect } from 'react';
import './App.css';
import BlockNumber from './components/BlockNumber';
import Count from './components/Count';
import CurrentWallet from './components/CurrentWallet';
import Pending from './components/Pending';
import Transfer from './components/Transfer';
import WalletConnector from './components/WalletConnector';

function App() {
  const initWallet = useInitWallet();
  const err = useWeb3Store((state) => state.error);

  useEffect(() => {
    initWallet(1001);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.error(err);
    if (err instanceof Error) {
      if (err.name === 'NoKaikasError') {
        alert('Kaikas 지갑이 없습니다.');
      } else if (err.name === 'NoMetaMaskError') {
        alert('Metamask 지갑이 없습니다.');
      }
      localStorage.removeItem('walletType');
    }
  }, [err]);

  return (
    <main>
      <section>
        <CurrentWallet></CurrentWallet>
        <WalletConnector />
      </section>
      <section>
        <Transfer></Transfer>
      </section>
      <section>
        <BlockNumber></BlockNumber>
        <Count></Count>
      </section>
      <Pending></Pending>
    </main>
  );
}

export default App;
