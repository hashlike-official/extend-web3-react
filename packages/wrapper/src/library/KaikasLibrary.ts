/* eslint-disable 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access
*/

import { Caver } from '@hashlike-official/extend-web3-react-kaikas';
import { KaikasContract } from '../contract';
import { WalletLibrary } from '../types/WalletLibrary';

export class KaikasLibrary extends WalletLibrary<Caver> {
  public async getBalanceOf(address: string) {
    const balance = await this.provider.klay.getBalance(address);
    return this.provider.utils.fromPeb(balance);
  }

  public async getBlockNumber() {
    const blockNumber = await this.provider.klay.getBlockNumber();
    return blockNumber;
  }

  public async transfer(from: string, to: string, value: number) {
    const estimatedGas = await this.provider.klay.estimateGas({
      from,
      to,
      value: this.provider.utils.toPeb(value, 'KLAY') as string,
    });
    const receipt = await this.provider.klay.sendTransaction({
      type: 'VALUE_TRANSFER',
      from,
      to,
      value: this.provider.utils.toPeb(value, 'KLAY') as string,
      gas: String(estimatedGas),
    });
    if (receipt.txError) return false;
    return true;
  }

  public contract(jsonInterface: any, address: string, account?: string) {
    const originContract = new this.provider.klay.Contract(jsonInterface, address);
    if (account) {
      originContract.options.from = account;
    }
    return new KaikasContract(originContract);
  }
}
