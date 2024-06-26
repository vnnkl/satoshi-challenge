import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';



export default function Web() {

  const [receiverId, setReceiverId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: "", balance: 0 });
  const [fetchUsersData, setFetchUsersData] = useState({ loading: false, error: null });

  useEffect(() => {
    setCurrentUser({ id: uuidv4(), balance: 0 });
  }, []);

  const handleSendTokens = async () => {
    if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
      setError("Amount must be a positive integer.");
      return;
    }

    try {
      await sendSatoshi(senderId, receiverId, Number(amount));  
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
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const updateCurrentUserBalance = () => {
      const currentUserData = users.find(user => user.id === currentUser.id);
      const currentUserBalance = currentUserData ? currentUserData.balance : 0;
      setCurrentUser(prevState => ({ ...prevState, balance: currentUserBalance }));
    };

    updateCurrentUserBalance();
  }, [users]);

  /**
   * Refreshes the balance of the current user by fetching the latest user data from the server.
   * Updates the users state and the current user's balance.
   * @async
   * @function handleRefreshBalance
   * @throws Will log an error message if the fetch request fails.
   */
  const handleRefreshBalance = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users);
      const currentUserData = users.find(user => user.id === currentUser.id);
      const currentUserBalance = currentUserData ? currentUserData.balance : 0;
      setCurrentUser({ id: currentUser.id, balance: currentUserBalance });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  /**
 * Sends Satoshi tokens from one user to another.
 * @param {string} senderId - The ID of the sender.
 * @param {string} receiverId - The ID of the receiver.
 * @param {number} amount - The amount of tokens to send.
 * @returns {Promise<string>} - A message indicating the result of the operation.
 * @throws Will throw an error if the request fails.
 */
  const sendSatoshi = async (senderId: string, receiverId: string, amount: number) => {
    try {
      const response = await fetch('/api/satsend/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, receiverId, amount }),
      });
      const data = await response.json();
      return data.message;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Provides Satoshi tokens to a user from the faucet.
   * @param {string} userId - The ID of the user to receive the tokens.
   * @throws Will throw an error if the request fails.
   */
  const faucetSatoshi = async (userId: string) => {
    try {
      await fetch('/api/satsend/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
      });
      handleRefreshBalance();
    } catch (error) {
      console.error('Failed to provide faucet satoshi:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1>Your ID: {currentUser.id ?? "Loading..."}</h1>
      <div className="flex flex-row items-center space-x-2">
        <h1>Your Balance: {currentUser.balance ?? "Loading..."}</h1>
        <button
          className={`pointer-events-auto rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white ${currentUser.balance > 0 ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"}`}
          onClick={() => faucetSatoshi(currentUser.id)}
          disabled={currentUser.balance > 0}
        >
          Gift me some!
        </button>
      </div>
      <button
        className="pointer-events-auto rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
        onClick={handleRefreshBalance}
      >
        Refresh Balance
      </button>
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
          <button
            className={`pointer-events-auto rounded-md px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white ${!senderId || !amount || users.find((user) => user.id === senderId)?.balance < parseInt(amount)
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            onClick={handleSendTokens}
            disabled={
              !senderId ||
              !amount ||
              users.find((user) => user.id === senderId)?.balance < parseInt(amount)
            }
          >
            Send
          </button>
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
