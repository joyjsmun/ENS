import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { ethers,providers } from 'ethers';
import { useEffect,useRef,useState } from 'react';


export default function Home() {
  const [walletConnected,setWalletConnected] = useState(false);
  const Web3ModalRef = useRef();
  const [ens,setEns] = useState("");
  const [address,setAddress] = useState("");

  const setENSOrAddress = async(address,web3Provider) => {
    //Lookup the ENS related to the given address
    var _ens = await web3Provider.lookupAddress(address);
    if(_ens){
      setEns(_ens);
    }else{
      setAddress(address);
    }
  }

  const getProviderOrSigner = async () => {
    const provider = await Web3ModalRef.current.connect();
    const web3Provider = new provider.web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Chnage the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    const signer = web3Provider.getSigner();
    // Get the address associated to the signer which is connected to Metamask
    const address = await signer.getAddress();
    // Calls the function to set the ENS or Address
    await setENSOrAddress(address,web3Provider);
    return signer;
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);

    } catch (err) {
      console.error(err);
    }
  }

  const renderButton = () => {
    if(walletConnected){
      <div>Wallet Connected</div>
    }else{
      return(
        <button onClick={connectWallet} className={styles.button} >
          Connect your wallet
        </button>
      )
    }
  }

  useEffect(() => {
    if(!walletConnected){
      Web3ModalRef.current = new Web3Modal({
        network:"goerli",
        providerOptions:{},
        disableInjectedProvider:false,
      });
      connectWallet();
    }
  },[walletConnected])
  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <link rel="icon" href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.main}>
            Welcome to LearnWeb3 Punks! {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            its an NFT collection for LearnWeb3 punks. 
          </div>
          {renderButton()}
        </div>
        <div>
        <img className={styles.image} src="./punks.png" />
        </div>
      </div>
    </div>
  )
}
