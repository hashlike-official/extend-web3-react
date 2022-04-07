import { CHAINS, useWeb3Store } from "web3-react-wrapper";

export default function Chain() {
  const { useChainId } = useWeb3Store((state) => state.hooks);
  const chainId = useChainId();
  const name = chainId ? CHAINS[chainId]?.name : undefined;

  if (name) {
    return (
      <div>
        Chain:{" "}
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
