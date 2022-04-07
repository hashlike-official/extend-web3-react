# @hashlike-official/extend-web3-react-kaikas

## example

```
import { initializeConnector } from "@web3-react/core";
import { Kaikas } from "@extend-web3-react/kaikas";

export const [kaikasConnector, kaikasHooks, kaikasStore] =
  initializeConnector<Kaikas>((actions) => new Kaikas(actions));

```
