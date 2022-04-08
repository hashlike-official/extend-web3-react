/* eslint-disable 
  @typescript-eslint/no-explicit-any,
*/

import { WrappedContract } from './WrappedContract';

export type WalletType = 'MetaMask' | 'Kaikas';

export abstract class WalletLibrary<T> {
  protected readonly provider: T;

  constructor(provider: T) {
    this.provider = provider;
  }

  abstract getBalanceOf(address: string): Promise<string>;

  abstract getBlockNumber(): Promise<number>;

  abstract transfer(from: string, to: string, value: number): Promise<boolean>;

  abstract contract(jsonInterface: any, address: string, account?: string): WrappedContract<any>;
}
