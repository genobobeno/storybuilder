"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createClient, LiveClient, LiveTranscriptionEvents } from "@deepgram/sdk";

interface DeepgramContextType {
  connectToDeepgram: () => Promise<void>;
  disconnectFromDeepgram: () => void;
  connectionState: string;
  realtimeTranscript: string;
}

const DeepgramContext = createContext<DeepgramContextType | undefined>(undefined);

export function useDeepgram() {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error('useDeepgram must be used within a DeepgramContextProvider');
  }
  return context;
}

export function DeepgramContextProvider({ children }: { children: ReactNode }) {
  const [deepgramClient, setDeepgramClient] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [realtimeTranscript, setRealtimeTranscript] = useState<string>('');

  const connectToDeepgram = async () => {
    try {
      const response = await fetch('/api/deepgram');
      const { key } = await response.json();
      const deepgram = createClient(key);

      const connection = deepgram.listen.live({
        language: 'en-US',
        smart_format: true,
        model: 'nova',
      });

      connection.addListener(LiveTranscriptionEvents.Open, () => {
        setConnectionState('connected');
      });

      connection.addListener(LiveTranscriptionEvents.Close, () => {
        setConnectionState('disconnected');
      });

      connection.addListener(LiveTranscriptionEvents.Transcript, (data) => {
        setRealtimeTranscript((prev) => prev + ' ' + data.channel.alternatives[0].transcript);
      });

      setDeepgramClient(connection);
    } catch (error) {
      console.error('Error connecting to Deepgram:', error);
      setConnectionState('error');
    }
  };

  const disconnectFromDeepgram = () => {
    if (deepgramClient) {
      deepgramClient.finish();
      setDeepgramClient(null);
      setConnectionState('disconnected');
    }
  };

  return (
    <DeepgramContext.Provider value={{
      connectToDeepgram,
      disconnectFromDeepgram,
      connectionState,
      realtimeTranscript,
    }}>
      {children}
    </DeepgramContext.Provider>
  );
}
