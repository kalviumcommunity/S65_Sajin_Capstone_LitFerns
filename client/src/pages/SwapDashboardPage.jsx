import React, { useState } from 'react';

const SwapRequestCard = ({ bookTitle, fromUser, status }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="font-bold text-lg">{bookTitle}</h3>
    <p className="text-sm text-gray-500 mb-2">Request from {fromUser}</p>
    <p>Status: <span className={`font-semibold ${status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>{status}</span></p>
    {status === 'Pending' && (
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 text-sm">Accept</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 text-sm">Decline</button>
      </div>
    )}
  </div>
);

const SwapDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Swap Dashboard</h1>
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('incoming')} className={`${activeTab === 'incoming' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Incoming Requests
          </button>
          <button onClick={() => setActiveTab('outgoing')} className={`${activeTab === 'outgoing' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
            Outgoing Requests
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'incoming' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SwapRequestCard bookTitle="The Silent Patient" fromUser="John Smith" status="Pending" />
            <SwapRequestCard bookTitle="Dune" fromUser="Alice Johnson" status="Accepted" />
          </div>
        )}
        {activeTab === 'outgoing' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SwapRequestCard bookTitle="Atomic Habits" fromUser="You" status="Pending" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapDashboardPage;