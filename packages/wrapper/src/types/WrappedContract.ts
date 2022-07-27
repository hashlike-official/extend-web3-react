/* eslint-disable 
  @typescript-eslint/no-explicit-any,
*/

type CallbackType = {
  onTransactionHash?: (hash: string) => void;
};

export type CallParamType = {
  methodName: string;
  params?: any[];
  option?: {
    from?: string;
    gasLimit?: any;
    gasPrice?: any;
  };
};

export type SendParamType = {
  methodName: string;
  params?: any[];
  option?: {
    from?: string;
    gasLimit?: any;
    gasPrice?: any;
    value?: any;
  };
  callback?: CallbackType;
};

export abstract class WrappedContract<SupportedContract> {
  protected readonly originContract: SupportedContract;

  constructor(originContract: SupportedContract) {
    this.originContract = originContract;
  }

  abstract call(params: CallParamType): Promise<any>;

  abstract send(params: SendParamType): Promise<any>;

  abstract estimateGas(params: SendParamType): Promise<any>;
}
