import { Web3Provider } from '@ethersproject/providers';
import { Contract as EthersContract } from '@ethersproject/contracts';
import { Caver, Contract as CaverContract } from '@hashlike-official/extend-web3-react-kaikas';

export type WalletType = 'MetaMask' | 'Kaikas';

export type SupportedProvider = Caver | Web3Provider;

export type SupportedContract = CaverContract | EthersContract;

export * from './WalletLibrary';
export * from './WrappedContract';
