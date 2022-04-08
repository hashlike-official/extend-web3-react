import { useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';

export default function Pending() {
  const pending = useWeb3Store((state) => state.pending);

  return <>{pending > 0 && <h2>처리 중...</h2>}</>;
}
