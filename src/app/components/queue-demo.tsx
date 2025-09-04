'use client';

import { useState, useEffect } from 'react';

interface Invocation {
  status: 'processing' | 'completed';
  startTime: number;
  endTime?: number;
  waitTime?: number;
}

export default function QueueDemo() {
  const [message, setMessage] = useState('');
  const [invocations, setInvocations] = useState<Record<string, Invocation>>({});
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/queue/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      const result = await response.json();
      if (result.success) {
        setMessage('');
        await fetch('/api/queue/consumer', { method: 'POST' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvocations = async () => {
    try {
      const response = await fetch('/api/queue/consumer');
      const result = await response.json();
      setInvocations(result.invocations || {});
    } catch (error) {
      console.error('Error fetching invocations:', error);
    }
  };

  useEffect(() => {
    fetchInvocations();
    const interval = setInterval(fetchInvocations, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Vercel Queue Demo</h2>
        
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send to Queue'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Queue Invocations</h3>
        
        {Object.keys(invocations).length === 0 ? (
          <p className="text-gray-500">No invocations yet. Send a message to get started!</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(invocations).map(([id, invocation]) => (
              <div key={id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-gray-600">ID: {id}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invocation.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invocation.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Started:</span>
                    <div>{new Date(invocation.startTime).toLocaleTimeString()}</div>
                  </div>
                  
                  {invocation.status === 'completed' && (
                    <>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <div>{invocation.endTime ? new Date(invocation.endTime).toLocaleTimeString() : 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Wait Time:</span>
                        <div className="font-semibold text-blue-600">{invocation.waitTime}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Duration:</span>
                        <div>{invocation.endTime ? invocation.endTime - invocation.startTime : 'N/A'}ms</div>
                      </div>
                    </>
                  )}
                  
                  {invocation.status === 'processing' && (
                    <div>
                      <span className="text-gray-500">Processing for:</span>
                      <div className="animate-pulse">{Date.now() - invocation.startTime}ms</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}