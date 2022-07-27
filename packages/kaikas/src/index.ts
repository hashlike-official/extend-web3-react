import type { Actions, AddEthereumChainParameter, Provider } from '@web3-react/types';
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

  /**
   * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
   */
  constructor(actions: Actions, connectEagerly = false) {
    super(actions);

    if (connectEagerly && typeof window === 'undefined') {
      throw new Error(
        'connectEagerly = true is invalid for SSR, instead use the connectEagerly method in a useEffect'
      );
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.klaytn === 'undefined') {
      this.actions.reportError(new NoKaikasError());
    } else {
      this.provider = window.klaytn;
      this.customProvider = new Caver(window.klaytn as RequestProvider);
      if (connectEagerly) void this.connectEagerly();
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
      cancelActivation();
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
  public async activate(
    desiredChainIdOrChainParameters?: number | AddEthereumChainParameter
  ): Promise<void> {
    if (!this.provider) return this.actions.reportError(new NoKaikasError());

    if (!this.provider._kaikas.isEnabled()) this.actions.startActivation();

    this.setChangeEventListener();

    try {
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
      if (error instanceof Error) {
        this.actions.reportError(error);
      }
    }
  }

  private setChangeEventListener() {
    if (!this.provider) return;

    this.provider.on('networkChanged', () => {
      this.actions.update({ chainId: Number(this.provider?.networkVersion) });
    });

    this.provider.on('accountsChanged', (accounts: string[]): void => {
      if (accounts.length === 0) {
        this.actions.reportError(undefined);
      } else {
        this.actions.update({ accounts });
      }
    });
  }
}
