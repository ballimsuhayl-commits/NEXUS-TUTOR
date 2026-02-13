import React, { useState } from 'react';
import { Subject, Message, StudyMode } from '../types';
import ChatInterface from './ChatInterface';
import LessonView from './LessonView';
import StudyNotesGenerator from './StudyNotesGenerator';
import { BookOpen, MessageCircle, BrainCircuit, FileText } from 'lucide-react';
import { SUBJECT_CONFIG } from '../constants';

interface SubjectHubProps {
  currentSubject: Subject;
  studyMode: StudyMode;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onToggleLive: () => void;
  isLive: boolean;
  onStartQuiz: () => void;
  isGeneratingQuiz: boolean;
  completedTopics: string[];
  onToggleTopicCompletion: (topicId: string) => void;
}

type Tab = 'lessons' | 'chat' | 'quiz' | 'notes';

const SubjectHub: React.FC<SubjectHubProps> = ({
  currentSubject,
  studyMode,
  messages,
  isLoading,
  onSendMessage,
  onToggleLive,
  isLive,
  onStartQuiz,
  isGeneratingQuiz,
  completedTopics,
  onToggleTopicCompletion
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('lessons');
  const config = SUBJECT_CONFIG[currentSubject];

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Tab Navigation */}
      <div className="flex p-1 bg-gray-200/50 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'lessons' 
              ? 'bg-white text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen size={18} className={activeTab === 'lessons' ? config.textColor : ''} />
          <span className="hidden sm:inline">Path</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'chat' 
              ? 'bg-white text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageCircle size={18} className={activeTab === 'chat' ? config.textColor : ''} />
          <span className="hidden sm:inline">Tutor</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'notes' 
              ? 'bg-white text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText size={18} className={activeTab === 'notes' ? config.textColor : ''} />
          <span className="hidden sm:inline">Notes</span>
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'quiz' 
              ? 'bg-white text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BrainCircuit size={18} className={activeTab === 'quiz' ? config.textColor : ''} />
          <span className="hidden sm:inline">Practice</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'lessons' && (
          <LessonView 
            currentSubject={currentSubject} 
            studyMode={studyMode} 
            completedTopics={completedTopics}
            onToggleTopicCompletion={onToggleTopicCompletion}
          />
        )}

        {activeTab === 'chat' && (
          <ChatInterface 
             messages={messages}
             isLoading={isLoading}
             currentSubject={currentSubject}
             onSendMessage={onSendMessage}
             onToggleLive={onToggleLive}
             isLive={isLive}
          />
        )}

        {activeTab === 'notes' && (
          <StudyNotesGenerator 
            currentSubject={currentSubject}
          />
        )}

        {activeTab === 'quiz' && (
           <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center animate-in fade-in">
                <div className={`w-24 h-24 rounded-full ${config.lightColor} flex items-center justify-center mb-6`}>
                    <config.icon size={48} className={config.textColor} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Check</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    Ready to test your {currentSubject} skills? Generating a quiz will create 5 custom questions based on the entire syllabus.
                </p>
                <button 
                    onClick={onStartQuiz}
                    disabled={isGeneratingQuiz}
                    className={`px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 ${config.color} ${isGeneratingQuiz ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isGeneratingQuiz ? <BrainCircuit className="animate-spin" /> : <BrainCircuit />}
                    {isGeneratingQuiz ? 'Constructing Quiz...' : 'Start New Quiz'}
                </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default SubjectHub;