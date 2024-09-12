'use client';

import { useState, useEffect, useRef } from 'react';
import { useDeepgram } from '../lib/contexts/DeepgramContext';
import { addDocument } from '../lib/firebase/firebaseUtils';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export default function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const { connectToDeepgram, disconnectFromDeepgram, connectionState, realtimeTranscript } = useDeepgram();

  const handleStartRecording = async () => {
    await connectToDeepgram();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    disconnectFromDeepgram();
    setIsRecording(false);
    if (silenceTimer) clearTimeout(silenceTimer);
    onTranscriptionComplete(realtimeTranscript);
  };

  useEffect(() => {
    if (isRecording) {
      if (silenceTimer) clearTimeout(silenceTimer);
      const timer = setTimeout(() => {
        handleStopRecording();
      }, 5000);
      setSilenceTimer(timer);
    }
  }, [realtimeTranscript, isRecording]);

  return (
    <div className="w-full">
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={`w-full py-2 px-4 rounded-full ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-bold`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-sm text-gray-600">{realtimeTranscript}</p>
        </div>
      )}
    </div>
  );
}