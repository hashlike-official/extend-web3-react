import { useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';

export default function WalletConnector() {
  const connect = useWeb3Store((state) => state.connect);

  return (
    <section>
      <button
        onClick={() => {
          connect('MetaMask', 1001);
        }}
      >
        MetaMask
      </button>
      <button
        onClick={() => {
          connect('Kaikas');
        }}
      >
        Kaikas
      </button>
    </section>
  );
}
