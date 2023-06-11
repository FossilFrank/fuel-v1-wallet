import fuel from '@fuel-js/wallet';
import { useState } from 'react';

declare global {
  interface Window { ethereum: any; }
}

let wallet: fuel.Wallet | null = null;

export const useWallet = () => {
  const refresh = useState({})[1];

  const connect = async () => {
    // @ts-ignore
    await window.ethereum.enable();
    wallet = new fuel.Wallet(window.ethereum, {});
    refresh({});
  }

  return { connect, wallet };
};
