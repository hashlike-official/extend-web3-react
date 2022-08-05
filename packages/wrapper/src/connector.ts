/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-return,
*/

import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Kaikas } from '@hashlike-official/extend-web3-react-kaikas';

export const [metamaskConnector, metamaskHooks, metamaskStore] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

export const [kaikasConnector, kaikasHooks, kaikasStore] = initializeConnector<Kaikas>(
  (actions) => new Kaikas(actions)
);
