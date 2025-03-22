import React, { useState, useEffect, useRef } from 'react';
import { IconMicrophone, IconMicrophoneOff } from './icons';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  disabled?: boolean;
  maxDuration?: number; // Maximum recording duration in seconds
}

// TypeScript types for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function VoiceInput({ 
  onTranscript, 
  onFinalTranscript,
  disabled = false, 
  maxDuration = 60 
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setIsInitializing(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Set up event handlers
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;

      // Update current transcript for visual feedback
      setCurrentTranscript(transcript);

      // Clear any existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Update interim results
      onTranscript(transcript);

      // If this is a final result, handle it
      if (lastResult.isFinal) {
        onFinalTranscript?.(transcript);
        setCurrentTranscript('');
      } else {
        // Set a timeout to detect silence
        silenceTimeoutRef.current = setTimeout(() => {
          if (transcript.trim()) {
            onFinalTranscript?.(transcript);
            setCurrentTranscript('');
          }
        }, 1500);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'Speech recognition error occurred.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found.';
          break;
        case 'network':
          errorMessage = 'Network error occurred.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission was denied.';
          break;
        case 'service-not-available':
          errorMessage = 'Speech recognition service is not available.';
          break;
        case 'bad-grammar':
          errorMessage = 'Grammar error occurred.';
          break;
        case 'language-not-supported':
          errorMessage = 'Language is not supported.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsRecording(false);
      setCurrentTranscript('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setCurrentTranscript('');
    };

    setIsInitializing(false);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxDurationRef.current) {
        clearTimeout(maxDurationRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      recognition.stop();
    };
  }, [onTranscript, onFinalTranscript]);

  const toggleRecording = async () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      if (isRecording) {
        recognition.stop();
        if (maxDurationRef.current) {
          clearTimeout(maxDurationRef.current);
        }
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      } else {
        setError(null);
        setCurrentTranscript('');
        await recognition.start();
        setIsRecording(true);

        // Set maximum duration timeout
        maxDurationRef.current = setTimeout(() => {
          recognition.stop();
          setIsRecording(false);
          setCurrentTranscript('');
        }, maxDuration * 1000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start/stop recording. Please try again.';
      setError(errorMessage);
      setIsRecording(false);
      setCurrentTranscript('');
    }
  };

  if (isInitializing) {
    return (
      <div className="relative">
        <button
          disabled
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
          title="Initializing..."
        >
          <IconMicrophone className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleRecording}
        disabled={disabled || !!error}
        className={`p-2 rounded-full transition-colors ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <IconMicrophoneOff className="w-5 h-5 text-white animate-pulse" />
        ) : (
          <IconMicrophone className="w-5 h-5" />
        )}
      </button>
      {error && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-red-100 text-red-700 rounded-md text-sm whitespace-nowrap">
          {error}
        </div>
      )}
      {isRecording && currentTranscript && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm max-w-xs">
          {currentTranscript}
        </div>
      )}
    </div>
  );
} 