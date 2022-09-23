import React, { useState, useEffect, useContext, useCallback } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import MushroomCards from '@/utils/mushroomCards';

interface Web3ContextInterface {
  connectWallet: () => Promise<void>;
  address: string;
  ens: string | null;
  mushroomCards: MushroomCards | null;
}

export const Web3Context = React.createContext<Web3ContextInterface>({
  connectWallet: async () => undefined,
  address: '',
  ens: '',
  mushroomCards: null,
});

export const Web3ContextProvider: React.FC = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [ens, setEns] = useState<string | null>('');
  const [mushroomCards, setMushroomCards] = useState<MushroomCards | null>(null);


  async function getEnsByAddress(
    provider: ethers.providers.Web3Provider,
    address: string
  ) {
    const ens = await provider.lookupAddress(address);
    return ens;
  }

  const initMushroomCards = useCallback((provider: any) => {
    
    const mushroomCards = new MushroomCards({
      provider,
      namespace: 'MushroomCards',
      env: 'STAGING',
    });

    console.log("useCallback", mushroomCards)

    setMushroomCards(mushroomCards);
  }, []);



  const connectWallet = React.useCallback(async () => {
    
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: {},
    });
    
    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const ens = await getEnsByAddress(provider, address);

    setAddress(address);
    setEns(ens);
    initMushroomCards(provider);
    
  }, [initMushroomCards]);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        address,
        ens,
        mushroomCards,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const web3 = useContext(Web3Context);
  return web3;
};
