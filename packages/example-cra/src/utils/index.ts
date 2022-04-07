import { useWeb3Store } from "web3-react-wrapper";

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
