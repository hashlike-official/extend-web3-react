/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access,
*/

import create from 'zustand';
import { Web3ReactHooks } from '@web3-react/core';
import { Connector, Web3ReactStore } from '@web3-react/types';
import { getAddChainParameters } from './chains';
import { WalletLibrary } from './types/WalletLibrary';
import { SupportedProvider, WalletType } from './types';

import {
  kaikasConnector,
  kaikasHooks,
  kaikasStore,
  metamaskConnector,
  metamaskHooks,
  metamaskStore,
} from './connector';

export type WalletLibraryStore = {
  connector: Connector;
  hooks: Web3ReactHooks;
  store: Web3ReactStore;
  currentType: WalletType | undefined;
  pending: number;
  balance: number;
  account: string;
  connect: (type: WalletType, chainId?: number) => Promise<void>;
  fetchBalance: (provider: WalletLibrary<SupportedProvider>) => Promise<void>;
};

export const useWeb3Store = create<WalletLibraryStore>((set, get) => ({
  connector: metamaskConnector,
  hooks: metamaskHooks,
  store: metamaskStore,
  currentType: undefined,
  pending: 0,
  balance: 0,
  account: '',
  fetchBalance: async (provider) => {
    const balance = await provider.getBalanceOf(get().account);
    set({ balance: Number(balance) });
  },
  connect: async (type, chainId?) => {
    window.localStorage.removeItem('walletType');
    void get().connector.deactivate();
    set({ currentType: type });
    window.localStorage.setItem('walletType', type);

    switch (type) {
      case 'MetaMask':
        await metamaskConnector.activate(chainId ? getAddChainParameters(chainId) : undefined);
        set({
          connector: metamaskConnector,
          hooks: metamaskHooks,
          store: metamaskStore,
        });
        break;
      case 'Kaikas':
        await kaikasConnector.activate(chainId);
        set({
          connector: kaikasConnector,
          hooks: kaikasHooks,
          store: kaikasStore,
        });
        break;
    }
  },
}));
