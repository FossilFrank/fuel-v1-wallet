import { useWallet } from "@/hooks/useWallet";

export default function AccountButton() {
  const { wallet, connect, disconnect } = useWallet();

  return (
    <button onClick={wallet ? disconnect : connect}>
      {wallet ? `Connected (${wallet.address?.substring(0, 6)})` : 'Connect'}
    </button>
  )
}
