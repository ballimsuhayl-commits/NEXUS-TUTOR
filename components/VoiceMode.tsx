import React, { useEffect, useState } from 'react';
import { MicOff, X, Activity } from 'lucide-react';
import { Subject, Mood } from '../types';
import { SUBJECT_CONFIG } from '../constants';

interface VoiceModeProps {
  isActive: boolean;
  currentSubject: Subject;
  mood: Mood;
  onClose: () => void;
  audioPower: number; // For visualizer (0-100)
}

const VoiceMode: React.FC<VoiceModeProps> = ({ isActive, currentSubject, mood, onClose, audioPower }) => {
  if (!isActive) return null;

  const config = SUBJECT_CONFIG[currentSubject];
  
  // Create a visualizer effect based on audio power
  const bars = 5;
  const visualizerBars = Array.from({ length: bars }).map((_, i) => {
    // Randomize slightly but base heavily on audioPower
    const height = Math.max(10, Math.min(100, audioPower * (1 + Math.random()) * 2));
    return (
      <div 
        key={i}
        className={`w-4 md:w-6 rounded-full transition-all duration-75 ${config.color.replace('bg-', 'bg-')}`}
        style={{ 
          height: `${height}%`,
          opacity: 0.7 + (audioPower / 200) 
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={onClose}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center max-w-md px-6 text-center space-y-12">
        
        {/* Status Text */}
        <div className="space-y-2">
            <h2 className={`text-3xl font-bold ${config.textColor}`}>Conversational Mode</h2>
            <p className="text-gray-500 font-medium">Listening to you...</p>
        </div>

        {/* Dynamic Visualizer */}
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Rings */}
            <div className={`absolute inset-0 rounded-full border-2 ${config.borderColor} opacity-30 animate-ping`} style={{ animationDuration: '3s' }}></div>
            <div className={`absolute inset-4 rounded-full border-2 ${config.borderColor} opacity-40 animate-ping`} style={{ animationDuration: '2s' }}></div>
            
            {/* Central Icon */}
            <div className={`relative z-10 w-32 h-32 rounded-full ${config.lightColor} flex items-center justify-center shadow-lg`}>
                <config.icon size={48} className={config.textColor} />
            </div>

            {/* Audio Bars Overlay - Simulated for now as we don't have analysis node hooked up in this view yet, using passed prop */}
            <div className="absolute -bottom-20 left-0 right-0 h-24 flex items-center justify-center gap-2">
                {visualizerBars}
            </div>
        </div>

        {/* Tip */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm max-w-sm">
            <p className="text-sm text-gray-600">
                <span className="font-semibold block mb-1 text-gray-800">Psychology Tip:</span>
                Talking through a problem out loud ("Self-Explanation") improves memory retention by 30%.
            </p>
        </div>

        {/* Controls */}
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors font-semibold border border-red-200 shadow-sm"
        >
          <MicOff size={20} />
          End Session
        </button>

      </div>
    </div>
  );
};

export default VoiceMode;
