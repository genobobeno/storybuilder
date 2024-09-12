'use client';

import { useState } from 'react';
import VoiceRecorder from './VoiceRecorder';
import TextEntry from './TextEntry';
import { addDocument } from '../lib/firebase/firebaseUtils';
import { useOpenAI } from '../lib/hooks/useOpenAI';

export default function FeatureRequestForm() {
  const [inputType, setInputType] = useState<'audio' | 'text'>('audio');
  const [requestText, setRequestText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { getAssistantResponse } = useOpenAI();

  const handleSubmit = async (text: string) => {
    setIsSubmitting(true);
    setRequestText(text);

    try {
      // Save request to Firebase
      const docRef = await addDocument('featureRequests', {
        text,
        timestamp: new Date().toISOString(),
      });

      // Get OpenAI response
      const assistantResponse = await getAssistantResponse(text);

      // Update Firebase document with assistant response
      await addDocument('featureRequests', {
        text: assistantResponse,
        timestamp: new Date().toISOString(),
        requestId: docRef.id,
      });

      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl mb-4">How would you like to enter your Feature Request?</h2>
      <div className="flex mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="audio"
            checked={inputType === 'audio'}
            onChange={() => setInputType('audio')}
            className="mr-2"
          />
          Audio Recording
        </label>
        <label>
          <input
            type="radio"
            value="text"
            checked={inputType === 'text'}
            onChange={() => setInputType('text')}
            className="mr-2"
          />
          Text Entry
        </label>
      </div>
      {inputType === 'audio' ? (
        <VoiceRecorder onTranscriptionComplete={handleSubmit} />
      ) : (
        <TextEntry onSubmit={handleSubmit} />
      )}
      {requestText && (
        <div className="mt-4">
          <p>The following Feature Request was sent:</p>
          <p className="italic">{requestText}</p>
        </div>
      )}
      {isSubmitting && (
        <div className="mt-4 flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
          <p>Sending Request...</p>
        </div>
      )}
      {showThankYou && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Thank you for your request!
        </div>
      )}
    </div>
  );
}