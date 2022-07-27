/* eslint-disable 
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-assignment
*/

import type {
  Actions,
  AddEthereumChainParameter,
  Provider,
  WatchAssetParameters,
} from '@web3-react/types';
import { Connector } from '@web3-react/types';
import Caver, { AbiItem, Contract, RequestProvider } from 'caver-js';

export { Caver, AbiItem, Contract };

declare global {
  interface Window {
    klaytn: KaikasProvider & RequestProvider;
  }
}

type KaikasProvider = Provider & {
  isKaikas: boolean;
  networkVersion: string;
  selectedAddress: string;
  enable: () => Promise<string[]>;
  sendAsync: (
    option: {
      method: string;
      params: any;
      id: number;
    },
    callback: (err: Error, result: any) => void
  ) => void;
  _kaikas: {
    isEnabled: () => boolean;
  };
};

export class NoKaikasError extends Error {
  public constructor() {
    super('Kaikas not installed');
    this.name = NoKaikasError.name;
    Object.setPrototypeOf(this, NoKaikasError.prototype);
  }
}

export class Kaikas extends Connector {
  /** {@inheritdoc Connector.provider} */
  public provider: KaikasProvider | undefined;
  public customProvider: Caver | undefined;

  constructor(actions: Actions, onError?: (error: Error) => void) {
    super(actions, onError);

    if (typeof window === 'undefined' || typeof window.klaytn === 'undefined') {
      this.onError?.(new NoKaikasError());
    } else {
      this.provider = window.klaytn;
      this.customProvider = new Caver(window.klaytn as RequestProvider);
    }
  }

  /** {@inheritdoc Connector.connectEagerly} */
  public async connectEagerly(): Promise<void> {
    const cancelActivation = this.actions.startActivation();

    if (!this.provider || !this.provider.isKaikas) return cancelActivation();

    this.setChangeEventListener();

    try {
      const accounts = await Promise.all([this.provider.enable()]);
      if (accounts.length) {
        this.actions.update({
          chainId: Number(this.provider.networkVersion),
          accounts: accounts[0],
        });
      } else {
        throw new Error('No accounts returned');
      }
    } catch (error) {
      console.debug('Could not connect eagerly', error);
      // we should be able to use `cancelActivation` here, but on mobile, metamask emits a 'connect'
      // event, meaning that chainId is updated, and cancelActivation doesn't work because an intermediary
      // update has occurred, so we reset state instead
      this.actions.resetState();
    }
  }

  /**
   * Initiates a connection.
   *
   * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
   * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
   * to the chain, if one of two conditions is met: either they already have it added in their extension, or the
   * argument is of type AddEthereumChainParameter, in which case the user will be prompted to add the chain with the
   * specified parameters first, before being prompted to switch.
   */
  public async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter) {
    let cancelActivation: (() => void) | undefined = undefined;

    if (!this.provider?._kaikas.isEnabled()) cancelActivation = this.actions.startActivation();

    try {
      this.setChangeEventListener();
      if (!this.provider) throw new NoKaikasError();

      const accounts = await Promise.all([this.provider.enable()]);
      const receivedChainId = Number(this.provider.networkVersion);
      const desiredChainId =
        typeof desiredChainIdOrChainParameters === 'number'
          ? desiredChainIdOrChainParameters
          : desiredChainIdOrChainParameters?.chainId;

      if (!desiredChainId || receivedChainId === desiredChainId) {
        return this.actions.update({
          chainId: receivedChainId,
          accounts: accounts[0],
        });
      } else {
        throw Error(
          `can't switch to chain ID: ${desiredChainId}. please manually switch network...`
        );
      }
    } catch (error) {
      cancelActivation?.();

      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async watchAsset({
    address,
    symbol,
    decimals,
    image,
  }: WatchAssetParameters): Promise<true> {
    if (!this.provider) throw new Error('No provider');

    return new Promise((res, rej) => {
      this.provider?.sendAsync(
        {
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address, // The address that the token is at.
              symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals, // The number of decimals in the token
              image, // A string url of the token logo
            },
          },
          id: Math.round(Math.random() * 100000),
        },
        (err) => {
          if (err) {
            rej(err);
          } else {
            res(true);
          }
        }
      );
    });
  }

  private setChangeEventListener() {
    if (!this.provider) return;

    this.provider.on('networkChanged', () => {
      this.actions.update({ chainId: Number(this.provider?.networkVersion) });
    });

    this.provider.on('accountsChanged', (accounts: string[]): void => {
      if (accounts.length === 0) {
        this.actions.resetState();
      } else {
        this.actions.update({ accounts });
      }
    });
  }
}
