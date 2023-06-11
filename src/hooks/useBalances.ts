import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";
import fuel from '@fuel-js/wallet';
import { ethers } from "ethers";
import { Token, useTokens } from "./useTokens";

interface Balance {
  balance: string;
  displayBalance: string;
}

export const useBalances = () => {
  const { tokens, isLoading: tokensLoading } = useTokens();
  const [balances, setBalances] = useState<(Balance & Token)[]>([]);
  const { wallet } = useWallet();

  const refreshTokens = async () => {
    if (!wallet || tokensLoading) {
      setBalances([]);
      return;
    }
    
    const _balances = await Promise.all(tokens.map(async (token: any): Promise<Balance & Token> => {
      const balance = await wallet.balance(parseInt(token.id));
      return {
        ...token,
        balance,
        displayBalance: ethers.utils.formatUnits(balance, token.decimals),
      }
    }));

    setBalances(_balances);
  }

  useEffect(() => {
    const refresh = setTimeout(refreshTokens, 2500);

    return () => clearTimeout(refresh);
  }, [wallet, tokens, tokensLoading]);

  return balances;
}