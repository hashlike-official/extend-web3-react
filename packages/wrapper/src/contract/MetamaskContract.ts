/* eslint-disable 
  @typescript-eslint/no-unsafe-member-access, 
  @typescript-eslint/no-unsafe-assignment, 
  @typescript-eslint/no-unsafe-call, 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-explicit-any,
*/
import { Contract } from "@ethersproject/contracts";
import { CallParamType, SendParamType, WrappedContract } from "../types/WrappedContract";

export class MetamaskContract extends WrappedContract<Contract> {
  call = async ({ methodName, params = [], option }: CallParamType) => {
    if (!this.originContract.functions[methodName]) {
      throw Error("Not Exist Method");
    }
    try {
      const result = await this.originContract[methodName](...params, {
        ...option,
      });
      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }
  };

  send = async ({ methodName, params = [], option }: SendParamType) => {
    if (!this.originContract[methodName]) {
      throw Error("Not Exist Method");
    }
    if (!option) {
      option = {};
    }
    if (!option.gasPrice) {
      option.gasPrice = await this.originContract.provider.getGasPrice();
    }
    if (!option.gasLimit) {
      option.gasLimit = await this.originContract.estimateGas[methodName](...params, { ...option });
    }

    const result = await this.originContract[methodName](...params, {
      ...option,
    });
    const receipt = await result.wait();

    return receipt;
  };
}
