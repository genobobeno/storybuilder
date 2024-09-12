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
  const [requestSent, setRequestSent] = useState(false);
  const [assistantFinished, setAssistantFinished] = useState(false);
  const { getAssistantResponse } = useOpenAI();

  const handleSubmit = async (text: string) => {
    setIsSubmitting(true);
    setRequestText(text);
    setRequestSent(true);

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
      setAssistantFinished(true);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {!requestSent && (
        <>
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
        </>
      )}
      {requestText && (
        <div className="mt-4">
          <p className="font-bold">The following Feature Request is being sent:</p>
          <p className="italic">{requestText}</p>
        </div>
      )}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 p-6 rounded-lg shadow-lg flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p>Sending Request...</p>
          </div>
        </div>
      )}
      {showThankYou && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Thank you for your request!
        </div>
      )}
      {assistantFinished && (
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-blue-600">
            Your feature request has been processed.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            You can close this dialog or reload the page to submit another feature request.
          </p>
        </div>
      )}
    </div>
  );
}