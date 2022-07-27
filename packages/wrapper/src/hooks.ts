/* eslint-disable 
  @typescript-eslint/no-explicit-any,
*/

import { useCallback, useEffect, useMemo } from 'react';

import { MetamaskLibrary } from './library/MetamaskLibrary';
import { KaikasLibrary } from './library/KaikasLibrary';
import { WalletLibrary } from './types/WalletLibrary';
import { useWeb3Store } from './store';
import { kaikasConnector, metamaskHooks } from './connector';
import { SupportedProvider, WalletType } from './types';

export function useProvider(): WalletLibrary<SupportedProvider> | undefined {
  const currentType = useWeb3Store((state) => state.currentType);
  const metamaskOriginProvider = metamaskHooks.useProvider();
  // eslint-disable-next-line
  const kaikasOriginProvider = kaikasConnector.customProvider!;

  return useMemo(() => {
    switch (currentType) {
      case 'MetaMask':
        if (metamaskOriginProvider) {
          return new MetamaskLibrary(metamaskOriginProvider);
        }
        break;
      case 'Kaikas':
        return new KaikasLibrary(kaikasOriginProvider);
    }
  }, [currentType, metamaskOriginProvider, kaikasOriginProvider]);
}

export function useTransfer() {
  const provider = useProvider();
  const fetchBalance = useWeb3Store((state) => state.fetchBalance);
  return useCallback(
    async (from: string, to: string, sendAmount: number) => {
      useWeb3Store.setState((state) => ({ pending: state.pending + 1 }));
      await provider?.transfer(from, to, sendAmount);
      useWeb3Store.setState((state) => ({ pending: state.pending - 1 }));
      if (provider) {
        void fetchBalance(provider);
      }
    },
    [provider, fetchBalance]
  );
}

export function useInitWallet() {
  const connect = useWeb3Store((state) => state.connect);
  const fetchBalance = useWeb3Store((state) => state.fetchBalance);
  const { useAccount } = useWeb3Store((state) => state.hooks);
  const provider = useProvider();

  const account = useAccount();

  useEffect(() => {
    if (account) {
      useWeb3Store.setState({ account });
    }
  }, [account]);

  useEffect(() => {
    if (provider && account && account.length > 0) {
      void fetchBalance(provider);
    }
  }, [provider, fetchBalance, account]);

  return (chainId: number) => {
    if (!window) return;
    const walletType = window.localStorage.getItem('walletType');
    if (walletType) {
      void connect(walletType as WalletType, chainId);
    }
  };
}
