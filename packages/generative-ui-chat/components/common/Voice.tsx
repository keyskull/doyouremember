// generative-ui-chat/components/common/vioce.tsx

"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button, Spinner } from "@heroui/react";
import { Icon } from '@iconify/react/dist/iconify.js';

interface VoiceProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}



export const Voice: React.FC<VoiceProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-content3 rounded-xl">
      <div className="text-lg font-medium">
        {isRecording ? 'Recording...' : 'Ready to Record'}
      </div>
      {isRecording && (
        <div className="flex items-center gap-2">
          <Spinner size="sm" color="danger" />
          <span>{formatDuration(recordingDuration)}</span>
        </div>
      )}
      <Button
        color={isRecording ? "danger" : "primary"}
        onClick={isRecording ? stopRecording : startRecording}
        startContent={isRecording ? <Icon icon={'bx:microphone'} /> : <Icon icon={"mdi:microphone"} />}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
    </div>
  );
};

export const VoiceExample = () => {
  return <Voice onRecordingComplete={(audioBlob) => {
    console.log('Audio recording complete:', audioBlob);
  }} />;
}