import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [agents, setAgents] = useState([
    {
      id: 'rag-agent',
      name: 'RAG Agent',
      description: 'Processes documents and stores them in Pinecone',
      workflowId: 'D7p5TNUzR4ETJWV5',
      status: 'active'
    },
    {
      id: 'qa-agent',
      name: 'HR QA Agent',
      description: 'Answers questions based on HR documentation',
      workflowId: 'hyNelSzWkmWzDQFR',
      status: 'active'
    }
  ]);

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Here you would integrate with your n8n workflow
    // Example implementation:
    // const formData = new FormData();
    // formData.append('file', file);
    // await fetch('your-n8n-webhook/upload', {
    //   method: 'POST',
    //   body: formData
    // });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">HR Admin Dashboard</h1>
      
      {/* Document Management */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Document Management</h2>
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Document
            </label>
            <input
              type="file"
              onChange={handleDocumentUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Documents</h3>
            <ul className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <li key={doc.id} className="py-3 flex justify-between items-center">
                  <span className="text-sm">{doc.name}</span>
                  <button
                    onClick={() => {/* Handle remove */}}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Agent Management */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Agent Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{agent.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  agent.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.status}
                </span>
                <button
                  onClick={() => {/* Handle toggle */}}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;