import { useEffect, useState } from "react";
import { Button } from "ui/components/Button/Button";
import { v4 as uuidv4 } from 'uuid';



export default function Web() {
  // const { data: balanceData, refetch } = useGetBalanceQuery();
  const [receiverId, setReceiverId] = useState("");
  const [senderId, setSenderId] = useState("");
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

  console.log(users);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1>Your ID: {users[0]?.id ?? "Loading..."}</h1>
      <h1>Your Balance: {users[0]?.balance ?? "Loading..."}</h1>
      <Button>Refresh Balance</Button>
      <div className="space-y-2">
        <h2>Send Satoshi Tokens</h2>
        <div className="flex space-x-2">
          <select
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            className="border p-2"
          >
            <option value="" disabled>Select Sender ID</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.id}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Receiver ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            className="border p-2"
          />
          <Button>Send</Button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users
              .slice()
              .sort((a, b) => b.balance - a.balance)
              .map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.balance}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}
