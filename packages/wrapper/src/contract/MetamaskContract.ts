/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access, 
  @typescript-eslint/no-unsafe-assignment, 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-explicit-any,
*/
import { Contract } from '@ethersproject/contracts';
import { formatEther } from '@ethersproject/units';
import { CallParamType, SendParamType, WrappedContract } from '../types/WrappedContract';

export class MetamaskContract extends WrappedContract<Contract> {
  constructor(originContract: Contract) {
    super(originContract);
  }

  public async call({ methodName, params = [], option = {} }: CallParamType) {
    if (!this.originContract.functions[methodName]) {
      throw Error('Not Exist Method');
    }
    return await this.originContract[methodName](...params, option);
  }

  public async send({ methodName, params = [], option = {}, callback }: SendParamType) {
    if (!this.originContract[methodName]) {
      throw Error('Not Exist Method');
    }

    if (!option.gasPrice) {
      option.gasPrice = await this.originContract.provider.getGasPrice();
    }

    const result = await this.originContract[methodName](...params, option);
    callback?.onTransactionHash?.(result.hash);

    return await result.wait();
  }

  public async estimateGas({ methodName, params = [], option = {} }: SendParamType) {
    const estimation = await this.originContract.estimateGas[methodName](...params, option);
    return formatEther(estimation);
  }
}
