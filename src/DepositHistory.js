import React, { useState, useEffect } from 'react';

function DepositHistory() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetch('/deposit-history')
      .then(response => response.json())
      .then(data => setDeposits(data.deposits))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Deposit History</h1>
      {deposits.map(deposit => (
        <div key={deposit._id}>
          <p>User Address: {deposit.userAddress}</p>
          <p>Pool: {deposit.pool}</p>
          <p>Token Address: {deposit.tokenAddress}</p>
          <p>Amount: {deposit.amount}</p>
          <p>Timestamp: {deposit.timestamp}</p>
        </div>
      ))}
    </div>
  );
}

export default DepositHistory;
