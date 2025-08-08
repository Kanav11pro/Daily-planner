
import { useState, useEffect } from 'react';
import { Celebration } from './Celebration';

interface PracticeCelebrationProps {
  show: boolean;
  onComplete: () => void;
  sessionData?: {
    subject: string;
    questions: number;
    time: number;
  };
}

export const PracticeCelebration = ({ show, onComplete, sessionData }: PracticeCelebrationProps) => {
  if (!show) return null;

  return <Celebration onComplete={onComplete} />;
};
