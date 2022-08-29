/* eslint-disable
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-explicit-any
*/
import { CallParamType, SendParamType, WrappedContract } from '../types/WrappedContract';
import { Contract } from '@hashlike-official/extend-web3-react-kaikas';

/**
 *
 * {@link https://docs.klaytn.foundation/dapp/sdk/caver-js/v1.4.1/api-references/caver.klay.contract}
 *
 */
export class KaikasContract extends WrappedContract<Contract> {
  constructor(originContract: Contract) {
    super(originContract);
  }

  public async call({ methodName, params = [], option = {} }: CallParamType) {
    if (!this.originContract.methods[methodName]) {
      throw Error('Not Exist Method');
    }
    const opt = this.parseOption({ option });
    if (!opt.gas) {
      opt.gas = await this.estimateGas({ methodName, params, option });
    }

    return await this.originContract.methods[methodName](...params).call(opt);
  }

  public async send({ methodName, params = [], option = {}, callback }: SendParamType) {
    if (!this.originContract.methods[methodName]) {
      throw Error('Not Exist Method');
    }
    const opt = this.parseOption({ option });
    if (!opt.gas) {
      opt.gas = await this.estimateGas({ methodName, params, option });
    }

    return await this.originContract.methods[methodName](...params).send(
      opt,
      (err: Error, txHash: string) => {
        callback?.onTransactionHash?.(txHash);
        if (err) {
          console.error(err);
        }
      }
    );
  }

  public async estimateGas({ methodName, params = [], option = {} }: SendParamType) {
    return await this.originContract.methods[methodName](...params).estimateGas({
      ...this.parseOption({ option }),
    });
  }

  private parseOption({ option }: Partial<SendParamType>) {
    let opt: any = {};
    if (option) {
      opt = {
        ...option,
      };
      if (option.gasLimit) {
        opt['gas'] = option.gasLimit;
      }
    }
    return opt;
  }
}
