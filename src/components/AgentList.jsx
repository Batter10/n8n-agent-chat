import React from 'react';

const AgentList = ({ agents, onSelectAgent }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelectAgent(agent)}
        >
          <h3 className="text-lg font-semibold">{agent.name}</h3>
          <p className="text-gray-600">{agent.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Workflow ID: {agent.workflowId}</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {agent.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentList;