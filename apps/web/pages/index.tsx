import { useEffect, useState } from "react";
import { Button } from "ui";



export default function Web() {
  // const { data: balanceData, refetch } = useGetBalanceQuery();
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [fetchUsersData, setFetchUsersData] = useState({ loading: false, error: null });

  const handleSendTokens = async () => {
    if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
      setError("Amount must be a positive integer.");
      return;
    }

    try {
      //await sendTokens({ receiverId, amount: Number(amount) }).unwrap();
      // refetch();
      setReceiverId("");
      setAmount("");
      setError("");
    } catch (err) {
      setError("Failed to send tokens. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        console.log(data);
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const mockBalanceData = {
    balance: 1000, // Example balance value
  };

  console.log(users);

  const [balanceData, setBalanceData] = useState(mockBalanceData);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1>Your Balance: {balanceData?.balance}</h1>
      <Button>Refresh Balance</Button>
      <div className="space-y-2">
        <h2>Send Satoshi Tokens</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Receiver ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2"
          />
          <Button>Send</Button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
