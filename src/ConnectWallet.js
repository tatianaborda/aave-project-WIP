import { useEffect, useState } from 'react';

function ConnectWallet() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = () => {
    const {ethereum} = window
    if(!ethereum){
      console.log("Please, install Metamask wallet")
      return
    }else{
      console.log("Everything fine!")
    }
   }

  const connectWalletHandler = async () => {
    const {ethereum} = window
    if(!ethereum){
      alert("Please, install Metamask wallet")
   }
   try{
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    console.log('account is ', accounts[0])
    setCurrentAccount(accounts[0])
   }catch(err){
    console.log(err)
   }
  }

  const connectWalletButton =  () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }


  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
      <div>
        {connectWalletButton()}
      </div>
  )
}

export default ConnectWallet;
