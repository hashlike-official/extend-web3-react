import { useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';

export default function Accounts() {
  const account = useWeb3Store((state) => state.account);
  const balance = useWeb3Store((state) => state.balance);

  return (
    <div>
      Account:{' '}
      <b>
        <div
          style={{
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {account}
        </div>
        {`(Ξ${balance})`}
      </b>
    </div>
  );
}
