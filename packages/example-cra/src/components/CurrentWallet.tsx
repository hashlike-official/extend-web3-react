import { useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';
import Accounts from './Accounts';
import Card from './Card';
import ChainId from './ChainId';
import Status from './Status';

export default function CurrentWallet() {
  const currentType = useWeb3Store((state) => state.currentType);

  return (
    <Card>
      <div>
        <b>{currentType}</b>
        <Status></Status>
        <div style={{ marginBottom: '1rem' }} />
        <ChainId></ChainId>
        <Accounts></Accounts>
      </div>
    </Card>
  );
}
