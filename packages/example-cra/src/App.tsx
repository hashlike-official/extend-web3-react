import { InitWalletLib } from "web3-react-wrapper";
import "./App.css";
import BlockNumber from "./components/BlockNumber";
import Count from "./components/Count";
import CurrentWallet from "./components/CurrentWallet";
import Pending from "./components/Pending";
import Transfer from "./components/Transfer";
import WalletConnector from "./components/WalletConnector";

function App() {
  InitWalletLib();
  return (
    <main>
      <section>
        <CurrentWallet></CurrentWallet>
        <WalletConnector />
      </section>
      <section>
        <Transfer></Transfer>
      </section>
      <section>
        <BlockNumber></BlockNumber>
        <Count></Count>
      </section>
      <Pending></Pending>
    </main>
  );
}

export default App;
