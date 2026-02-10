import React from 'react';
import { Subject, Mood, ModelMode } from '../types';
import { SUBJECT_CONFIG, MOOD_ICONS } from '../constants';
import { Settings, Zap, Brain, Sparkles, Cpu } from 'lucide-react';

interface HeaderProps {
  currentSubject: Subject;
  currentMood: Mood;
  currentModelMode: ModelMode;
  onSubjectChange: (subject: Subject) => void;
  onMoodChange: (mood: Mood) => void;
  onModelModeChange: (mode: ModelMode) => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentSubject, 
  currentMood, 
  currentModelMode, 
  onSubjectChange, 
  onMoodChange, 
  onModelModeChange, 
  onOpenSettings 
}) => {
  
  const activeConfig = SUBJECT_CONFIG[currentSubject];

  const getModelIcon = (mode: ModelMode) => {
    switch(mode) {
      case ModelMode.FAST: return <Zap size={16} className="text-yellow-500" />;
      case ModelMode.BALANCED: return <Cpu size={16} className="text-blue-500" />;
      case ModelMode.SMART: return <Sparkles size={16} className="text-purple-500" />;
      case ModelMode.DEEP: return <Brain size={16} className="text-pink-500" />;
      default: return <Cpu size={16} />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeConfig.color} text-white transition-colors duration-300`}>
              <activeConfig.icon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 hidden md:block">IEB Nexus</h1>
              <p className={`text-sm font-medium ${activeConfig.textColor}`}>{currentSubject}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Model Selector */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                 {getModelIcon(currentModelMode)}
                 <span className="text-xs font-semibold text-gray-700 max-w-[80px] truncate md:max-w-none">{currentModelMode}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 p-2 hidden group-hover:block hover:block z-50">
                  <p className="text-xs text-gray-400 px-2 pb-2 border-b border-gray-50 mb-1">Select AI Model</p>
                  <div className="grid grid-cols-1 gap-1">
                      {Object.values(ModelMode).map((m) => (
                          <button 
                            key={m}
                            onClick={() => onModelModeChange(m)}
                            className={`flex items-center gap-3 px-2 py-2 text-xs font-medium rounded-md hover:bg-gray-50 w-full text-left ${currentModelMode === m ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                          >
                              {getModelIcon(m)}
                              {m}
                          </button>
                      ))}
                  </div>
              </div>
            </div>

            {/* Subject Dropdown (Mobile optimized) */}
            <select 
              value={currentSubject}
              onChange={(e) => onSubjectChange(e.target.value as Subject)}
              className="block w-28 md:w-48 pl-2 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-gray-50"
            >
              {Object.values(Subject).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Mood Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                 <span className="text-xl">{MOOD_ICONS[currentMood]}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 p-2 hidden group-hover:block hover:block z-50">
                  <p className="text-xs text-gray-400 px-2 pb-2">How are you feeling?</p>
                  <div className="grid grid-cols-1 gap-1">
                      {Object.values(Mood).map((m) => (
                          <button 
                            key={m}
                            onClick={() => onMoodChange(m)}
                            className={`flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-blue-50 w-full text-left ${currentMood === m ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                          >
                              <span>{MOOD_ICONS[m]}</span>
                              {m}
                          </button>
                      ))}
                  </div>
              </div>
            </div>

            <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <Settings size={20} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;