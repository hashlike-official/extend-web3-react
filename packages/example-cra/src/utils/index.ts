import { useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';

export async function callWithPending(promi: Promise<any>) {
  try {
    useWeb3Store.setState((state) => ({
      pending: state.pending + 1,
    }));
    const result = await promi;
    return result;
  } catch (e) {
    console.error(e);
  } finally {
    useWeb3Store.setState((state) => ({
      pending: state.pending - 1,
    }));
  }
}

export function useChain() {
  const { useChainId } = useWeb3Store((state) => state.hooks);
  const chainId = useChainId();
  return chainId;
}
