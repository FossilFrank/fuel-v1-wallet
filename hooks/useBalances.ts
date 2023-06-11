import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";
import fuel from '@fuel-js/wallet';

interface Balance {
  asset: string;
  balance: string;
  displayBalance: string;
}

export const useBalances = () => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const { wallet } = useWallet();

  const refreshTokens = async () => {
    if (!wallet) {
      setBalances([]);
      return;
    }

    const tokenRes = await fetch("https://api.thegraph.com/subgraphs/name/fossilfrank/fuel-v1", {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          tokens {
            id
            token
            name
            symbol
            decimals
          }
        }`,
      }),
      method: "POST",
    });
    const { data } = await tokenRes.json();

    const _balances = await Promise.all(data.tokens.map(async (token: any) => {
      const balance = await wallet.balance(parseInt(token.id));
      return {
        ...token,
        balance,
        displayBalance: fuel.utils.formatEther(balance, token.decimals),
      }
    }));

    setBalances(_balances);
  }

  useEffect(() => {
    const refresh = setTimeout(refreshTokens, 2500);

    return () => clearTimeout(refresh);
  }, [wallet]);

  return balances;
}