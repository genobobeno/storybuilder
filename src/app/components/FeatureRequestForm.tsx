'use client';

import React, { useState } from 'react';
import { addDocument } from '@/lib/firebase/firebaseUtils';
import { useOpenAI } from '@/lib/hooks/useOpenAI';

export default function FeatureRequestForm() {
  const [requestText, setRequestText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { getAssistantResponse } = useOpenAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    setSubmittedText(requestText);
    setIsSubmitting(true);

    try {
      // Save request to Firebase
      const docRef = await addDocument('featureRequests', {
        text: requestText,
        timestamp: new Date().toISOString(),
      });

      // Get OpenAI response
      const assistantResponse = await getAssistantResponse(requestText);

      // Update Firebase document with assistant response
      await addDocument('featureRequests', {
        text: assistantResponse,
        timestamp: new Date().toISOString(),
        requestId: docRef.id,
      });

      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
      setRequestText('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Please describe your Feature Request!</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          rows={4}
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="Enter your feature request here..."
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isSubmitting || !requestText.trim()}
        >
          Send Request
        </button>
      </form>

      {submittedText && (
        <div className="mt-4 relative">
          <p className="font-semibold">The following Feature Request was sent:</p>
          <p className="italic mt-2">{submittedText}</p>
          {isSubmitting && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center">Sending Request...</p>
            </div>
          )}
        </div>
      )}

      {isComplete && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-md">
          <p className="text-center text-green-700">
            Thank you for your request! The process is complete.
          </p>
        </div>
      )}
    </div>
  );
}