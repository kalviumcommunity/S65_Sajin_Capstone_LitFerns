import React from 'react';

const DashboardPage = () => {
  const userName = 'User'; 

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Your Dashboard, {userName}!</h1>
      <p>Here you can manage your books and swaps.</p>
    </div>
  );
};

export default DashboardPage;