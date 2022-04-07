/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access, 
  @typescript-eslint/no-unsafe-assignment, 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-explicit-any
*/
import {
  CallParamType,
  SendParamType,
  WrappedContract,
} from "../types/WrappedContract";
import { Contract } from "@extend-web3-react/kaikas";

export class KaikasContract extends WrappedContract<Contract> {
  call = async ({ methodName, params = [], option }: CallParamType) => {
    if (!this.originContract.methods[methodName]) {
      throw Error("Not Exist Method");
    }
    try {
      const result = await this.originContract.methods[methodName](
        ...params
      ).call({ ...option });
      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }
  };

  send = async ({ methodName, params = [], option }: SendParamType) => {
    if (!this.originContract.methods[methodName]) {
      throw Error("Not Exist Method");
    }
    let gas;
    if (!option?.gasLimit) {
      gas = await this.originContract.methods[methodName](
        ...params
      ).estimateGas({
        ...option,
      });
    } else {
      gas = option.gasLimit;
    }
    console.log(gas);

    const result = await this.originContract.methods[methodName](
      ...params
    ).send({ ...option, gas });
    return result;
  };
}
