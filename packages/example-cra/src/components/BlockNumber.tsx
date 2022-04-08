import { useCallback, useEffect, useState } from 'react';
import { useProvider } from '@hashlike-official/extend-web3-react-wrapper';

export default function BlockNumber() {
  const provider = useProvider();
  const [blockNumber, setBlockNumber] = useState(0);

  const getBlockNumber = useCallback(async () => {
    if (provider) {
      const blockNumber = await provider.getBlockNumber();
      setBlockNumber(blockNumber);
    }
  }, [provider]);

  useEffect(() => {
    const intervalId = setInterval(getBlockNumber, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [getBlockNumber]);

  return <h1>block number: {blockNumber}</h1>;
}
