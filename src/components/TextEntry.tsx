'use client';

import { useState } from 'react';

interface TextEntryProps {
  onSubmit: (text: string) => void;
}

export default function TextEntry({ onSubmit }: TextEntryProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
        rows={4}
        placeholder="Enter your feature request here..."
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
      >
        Send Request
      </button>
    </form>
  );
}