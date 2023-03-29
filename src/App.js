import './App.css';
import ConnectWallet from './ConnectWallet';
import DepositHistory from './DepositHistory';
//import contract from './artifacts/contracts/PoolInteractions.sol/PoolInteractions.json'


const contractAddress = "0xEd0430383d15540d87002ad30b4b5f0381dab1f8";
//const abi = contract.abi;


function App() {

  return (
    <div className='main-app'>
      <h1>Aave App</h1>
      <ConnectWallet/>
      <DepositHistory/>
    </div>
  )
}

export default App;
