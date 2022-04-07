import { useWeb3Store } from "@hashlike-official/extend-web3-react-wrapper";

export default function Status() {
  const { useIsActivating, useError, useIsActive } = useWeb3Store(
    (state) => state.hooks
  );
  const error = useError();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  return (
    <div>
      {error ? (
        <>
          🔴 {error.name ?? "Error"}
          {error.message ? `: ${error.message}` : null}
        </>
      ) : isActivating ? (
        <>🟡 Connecting</>
      ) : isActive ? (
        <>🟢 Connected</>
      ) : (
        <>⚪️ Disconnected</>
      )}
    </div>
  );
}
