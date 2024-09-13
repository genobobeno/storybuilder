import React, { useState } from 'react';
import TextInput from './TextInput';

const AIAssistant: React.FC = () => {
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/openai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const data = await response.json();
      setAssistantResponse(data.response);
    } catch (error) {
      console.error('Error getting assistant response:', error);
      setAssistantResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 relative">
      <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
      <TextInput onSubmit={handleSubmit} />
      {isLoading && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
          <p className="text-center mt-4 font-semibold relative z-10">Processing your request...</p>
        </>
      )}
      {assistantResponse && (
        <div className="space-y-2 mt-4">
          <h3 className="font-bold">Assistant Response:</h3>
          <p>{assistantResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;