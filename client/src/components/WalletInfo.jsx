import { useState, useEffect } from "react";
import { useAuth } from "../Context/Auth";

const WalletInfo = () => {
  const { isAuthenticated, API, token } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`${API}/wallet`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Authentication failed');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            setBalance(data.data.walletBalance);
          } else {
            setError(data.message || 'Failed to fetch balance');
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch balance');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, API]);

  // Not authenticated state - don't show anything
  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-3">
        <div className="text-right">
          <div className="text-xs text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3">
        <div className="text-right">
          <div className="text-xs text-red-500">Error</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3">
      <div className="text-right">
        <div className="text-xs text-gray-500">Wallet Balance</div>
        <div className="text-lg font-bold text-green-600">₹{balance}</div>
      </div>
    </div>
  );
};

export default WalletInfo;