# @hashlike-official/extend-web3-react-wrapper

It offers a common interface for different wallet providers.  
currently, metamask and kaikas.

You can easily extend this library to integrate other wallet what you want.  
Just implement abstract classes under src/types folder.

- abstract class WalletLibrary
- abstract class WrappedContract

## example

Look packages/example-cra  

### state management

using zustand, manage states below:

- states from web3-react
- currently connected wallet, account, balance  
- functions that can change states

```typescript
type WalletType = "MetaMask" | "Kaikas";

type WalletLibraryType = {
  connector: Connector;
  hooks: Web3ReactHooks;
  store: Web3ReactStore;
  currentType: WalletType | undefined;
  pending: number;
  balance: number;
  account: string;
  connect: (type: WalletType, chainId?: number) => Promise<void>;
  fetchBalance: (provider: WalletLibrary<any>) => Promise<void>;
};

```  

you can get state inside react components like this:

```typescript
import { useWeb3Store } from "@hashlike-official/extend-web3-react-wrapper";

export default function MyComponent() {
  const account = useWeb3Store(state => state.account);
  const connect = useWeb3Store(state => state.connect);
  // ...
}
```

### hooks

- useProvider : it return connected wallet's provider like Web3Provider(@ethersproject/providers), Caver(caver-js)

  ```typescript
  const provider = useProvider();
  // ...
  const getBlockNumber = useCallback(async () => {
    if (provider) {
      const blockNumber = await provider.getBlockNumber();
      setBlockNumber(blockNumber);
    }
  }, [provider]);
  // ...
  ```

- useTransfer : it return function which can submits transaction to the network to be mined.

  ```typescript
  const transfer = useTransfer();
  const account = useWeb3Store((state) => state.account);
  // ...
  const sendButtonHandler = () => {
    if (account) {
      transfer(account, sendAddress, sendKlay);
    }
  };
  // ...
  ```

- InitWalletLib : using this hook, you can initialize account, balance with specipic wallet type which stored in localStorage. and can use this hook with specific chainId.(but it doesn't work with kaikas)

  ```typescript
  function App() {
    InitWalletLib(1001);
    // ...
  }
  ```
