import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Loader } from 'lucide-react';

const ChatWindow = ({ agent, onSendMessage, messages = [], isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await onSendMessage({
        text: input,
        agentId: agent.id,
        webhookUrl: agent.webhookUrl,
        sessionId: agent.sessionId
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <MessageSquare className="w-5 h-5 mr-2" />
        <div>
          <h2 className="font-semibold">{agent.name}</h2>
          <p className="text-sm text-gray-500">{agent.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.metadata && (
                <div className="mt-2 text-xs opacity-70">
                  <p>Source: {message.metadata.source}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type je bericht..."
            className="flex-1 p-2 border rounded-lg resize-none"
            rows="3"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
          >
            Verstuur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;