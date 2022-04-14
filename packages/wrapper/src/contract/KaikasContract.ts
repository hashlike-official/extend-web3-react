/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access, 
  @typescript-eslint/no-unsafe-assignment, 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-explicit-any
*/
import { CallParamType, SendParamType, WrappedContract } from '../types/WrappedContract';
import { Contract } from '@hashlike-official/extend-web3-react-kaikas';

export class KaikasContract extends WrappedContract<Contract> {
  public async call({ methodName, params = [], option }: CallParamType) {
    if (!this.originContract.methods[methodName]) {
      throw Error('Not Exist Method');
    }
    try {
      const result = await this.originContract.methods[methodName](...params).call({ ...option });
      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }
  }

  public async send({ methodName, params = [], option, callback }: SendParamType) {
    if (!this.originContract.methods[methodName]) {
      throw Error('Not Exist Method');
    }
    let gas;
    if (option?.gasLimit) {
      gas = option.gasLimit;
    } else {
      const estimation = await this.estimateGas({ methodName, params, option });
      gas = Number((estimation * 1.2).toFixed(0));
    }

    const result = await this.originContract.methods[methodName](...params).send(
      {
        ...option,
        gas,
      },
      (err: any, txHash: string) => {
        if (callback?.onTransactionHash) {
          callback.onTransactionHash(txHash);
        }
      }
    );
    return result;
  }

  public async estimateGas({ methodName, params = [], option }: SendParamType) {
    const estimation = await this.originContract.methods[methodName](...params).estimateGas({
      ...option,
    });
    return estimation;
  }
}
