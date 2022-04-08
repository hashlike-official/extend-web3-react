import { CHAINS } from '@hashlike-official/extend-web3-react-wrapper';
import { useChain } from '../utils';

export default function Chain() {
  const chainId = useChain();
  const name = chainId ? CHAINS[chainId]?.name : undefined;

  if (name) {
    return (
      <div>
        Chain:{' '}
        <b>
          {name} ({chainId})
        </b>
      </div>
    );
  }

  return (
    <div>
      Chain Id: <b>{chainId}</b>
    </div>
  );
}
