import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatUnits,
  useProvider,
  useWeb3Store,
} from "@hashlike-official/extend-web3-react-wrapper";
import deployedABI from "../../deployedABI.json";
import { callWithPending } from "../utils";

const deployedAddress = "0xb4bF60383C64D47F2E667f2fE8F7ED0c9380f770";

function useCountContract() {
  const provider = useProvider();
  const account = useWeb3Store((state) => state.account);
  return useMemo(() => {
    return provider?.contract(deployedABI, deployedAddress, account);
  }, [provider, account]);
}

export default function Count() {
  const contract = useCountContract();
  const [count, setCount] = useState(0);

  const getCount = useCallback(async () => {
    if (contract) {
      const count = await contract.call({ methodName: "count" });
      if (typeof count === "object") {
        const formated = formatUnits(count, "wei");
        setCount(Number(formated));
      } else {
        setCount(count);
      }
    }
  }, [contract]);

  const plusCount = useCallback(async () => {
    if (contract) {
      const result = await callWithPending(
        contract.send({
          methodName: "plus",
        })
      );
      console.log(result);
    }
  }, [contract]);

  const minusCount = useCallback(async () => {
    if (contract) {
      const result = await callWithPending(
        contract.send({
          methodName: "minus",
        })
      );
      console.log(result);
    }
  }, [contract]);

  useEffect(() => {
    const intervalId = setInterval(getCount, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [getCount]);

  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={() => plusCount()}>plus</button>
      <button onClick={() => minusCount()}>minus</button>
    </>
  );
}
