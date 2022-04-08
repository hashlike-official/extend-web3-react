/* eslint-disable 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-explicit-any,
*/

import { Web3Provider } from '@ethersproject/providers';
import { formatEther, parseEther, formatUnits, parseUnits } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';
import { WalletLibrary } from '../types/WalletLibrary';
import { MetamaskContract } from '../contract';

export class MetamaskLibrary extends WalletLibrary<Web3Provider> {
  public async getBalanceOf(address: string) {
    const balance = await this.provider.getBalance(address);
    return formatEther(balance);
  }

  public async getBlockNumber() {
    const blockNumber = await this.provider.getBlockNumber();
    return blockNumber;
  }

  public async transfer(from: string, to: string, value: number) {
    const signer = this.provider.getSigner(from);
    const gasPrice = await this.provider.getGasPrice();
    const estimatedGas = await this.provider.estimateGas({
      to,
      value: parseEther(String(value)),
      gasPrice,
    });
    const response = await signer.sendTransaction({
      to,
      value: parseEther(String(value)),
      gasPrice,
      gasLimit: estimatedGas,
    });
    const receipt = await response.wait();
    if (receipt.status && receipt.status === 0) {
      return false;
    }
    return true;
  }

  public contract(jsonInterface: any, address: string, account?: string) {
    let signer;
    if (account) {
      signer = this.provider.getSigner(account);
    }

    const originContract = new Contract(address, jsonInterface, signer ? signer : this.provider);
    return new MetamaskContract(originContract);
  }
}

export { formatEther, parseEther, formatUnits, parseUnits };
