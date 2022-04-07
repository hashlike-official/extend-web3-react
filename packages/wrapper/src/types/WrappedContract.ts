/* eslint-disable 
  @typescript-eslint/no-explicit-any,
*/

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
};

export abstract class WrappedContract<T> {
  protected readonly originContract: T;

  constructor(originContract: T) {
    this.originContract = originContract;
  }

  abstract call: ({ methodName, params, option }: CallParamType) => Promise<any>;

  abstract send: ({ methodName, params, option }: SendParamType) => Promise<any>;
}
