import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import fuel from '@fuel-js/wallet';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useBalances } from '@/hooks/useBalances';
import { useTokens } from '@/hooks/useTokens';
import AccountButton from '@/components/AccountButton';
import { ethers } from 'ethers';

const inter = Inter({ subsets: ['latin'] })

export default function Deposit() {
  const { tokens } = useTokens();
  const { wallet, connect } = useWallet();
  const [balance, setBalance] = useState(0);
  const balances = useBalances();
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState("0x0000000000000000000000000000000000000000");

  const deposit = async () => {
    const selectedToken = tokens.find(t => t.token === token);
    if (!selectedToken) return;
    const tx = await wallet!.deposit(token, ethers.utils.parseUnits(amount, selectedToken.decimals));
    console.log(tx);
  }

  return (
    <div>
      <AccountButton />
      <div>
        <select value={token} onChange={e => setToken(e.target.selectedOptions[0].value)}>
          {tokens.map(token => (
            <option key={token.token} value={token.token}>{token.symbol}</option>
          ))}
        </select>
      </div>
      <div>
        <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div>
        <button onClick={deposit} disabled={!wallet}>Deposit</button>
      </div>
    </div>
  );
}