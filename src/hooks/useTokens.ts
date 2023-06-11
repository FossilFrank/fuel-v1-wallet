import { useQuery } from 'react-query';

export interface Token {
  id: string;
  token: string;
  name: string;
  symbol: string;
  decimals: number;
}

async function getTokens() {
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
  const { data }: { data: { tokens: Token[] } } = await tokenRes.json();

  return data.tokens;
}

export function useTokens() {
  const { data: tokens, isLoading, isError } = useQuery('tokens', getTokens);
  return { tokens: tokens || [], isLoading, isError };
}
