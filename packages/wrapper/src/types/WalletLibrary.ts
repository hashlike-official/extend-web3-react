/* eslint-disable 
  @typescript-eslint/no-explicit-any,
*/

import { SupportedContract } from '.';
import { WrappedContract } from './WrappedContract';

export abstract class WalletLibrary<SupportedProvider> {
  protected readonly provider: SupportedProvider;

  constructor(provider: SupportedProvider) {
    this.provider = provider;
  }

  abstract getBalanceOf(address: string): Promise<string>;

  abstract getBlockNumber(): Promise<number>;

  abstract transfer(from: string, to: string, value: number): Promise<boolean>;

  abstract contract(
    jsonInterface: any,
    address: string,
    account?: string
  ): WrappedContract<SupportedContract>;
}
