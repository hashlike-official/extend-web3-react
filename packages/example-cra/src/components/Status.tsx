import { useWeb3Store } from '@hashlike-official/extend-web3-react-wrapper';

export default function Status() {
  const { useIsActivating, useIsActive } = useWeb3Store((state) => state.hooks);
  const error = useWeb3Store((state) => state.error);
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  return (
    <div>
      {error ? (
        <>
          🔴 {error.name ?? 'Error'}
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
